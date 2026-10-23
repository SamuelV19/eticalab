import { PRINCIPLE_IDS } from '../data/principles'
import { GROUP_CATEGORIES, RISK_CATEGORIES } from '../data/taxonomy'
import { SYSTEM_TYPES } from '../types'
import type {
  AffectedGroup,
  Alternative,
  BackupFile,
  Decision,
  Evaluation,
  PrincipleAssessment,
  PrincipleId,
  PrincipleStatus,
  Risk,
  Severity,
  SystemType,
} from '../types'
import { emptyAssessments, emptyDecision } from './factory'
import { uid } from './id'

type Rec = Record<string, unknown>

const isRec = (v: unknown): v is Rec => typeof v === 'object' && v !== null && !Array.isArray(v)
const str = (v: unknown, max = 5000): string => (typeof v === 'string' ? v.slice(0, max) : '')
const isIso = (v: unknown): v is string => typeof v === 'string' && !Number.isNaN(new Date(v).getTime())

const SYSTEM_VALUES = SYSTEM_TYPES.map((t) => t.value)
const GROUP_VALUES = GROUP_CATEGORIES.map((g) => g.value)
const RISK_VALUES = RISK_CATEGORIES.map((r) => r.value)
const STATUSES: PrincipleStatus[] = ['cumplido', 'atencion', 'no_evaluado']
const SEVERITY_VALUES: Severity[] = ['baja', 'media', 'alta']

function pick<T extends string>(v: unknown, allowed: readonly T[], fallback: T): T {
  return typeof v === 'string' && (allowed as readonly string[]).includes(v) ? (v as T) : fallback
}

function parseGroup(v: unknown): AffectedGroup | null {
  if (!isRec(v)) return null
  return {
    id: str(v.id, 80) || uid('grp'),
    category: pick(v.category, GROUP_VALUES, 'usuarios'),
    name: str(v.name, 300),
    description: str(v.description),
  }
}

function parseRisk(v: unknown): Risk | null {
  if (!isRec(v)) return null
  return {
    id: str(v.id, 80) || uid('rsk'),
    category: pick(v.category, RISK_VALUES, 'privacidad'),
    description: str(v.description),
    affected: str(v.affected),
    consequences: str(v.consequences),
    preventive: str(v.preventive),
    severity: pick(v.severity, SEVERITY_VALUES, 'media'),
  }
}

function parseAlternative(v: unknown): Alternative | null {
  if (!isRec(v)) return null
  const principles = Array.isArray(v.principles)
    ? (v.principles.filter((p): p is PrincipleId => typeof p === 'string' && (PRINCIPLE_IDS as string[]).includes(p)))
    : []
  return {
    id: str(v.id, 80) || uid('alt'),
    name: str(v.name, 300),
    description: str(v.description),
    benefits: str(v.benefits),
    risks: str(v.risks),
    affected: str(v.affected),
    principles: Array.from(new Set(principles)),
    limitations: str(v.limitations),
    mitigation: str(v.mitigation),
  }
}

function parseDecision(v: unknown): Decision {
  if (!isRec(v)) return emptyDecision()
  return {
    chosenAlternativeId: str(v.chosenAlternativeId, 80),
    justification: str(v.justification),
    acceptedRisks: str(v.acceptedRisks),
    actions: str(v.actions),
    reviewer: str(v.reviewer, 300),
    nextReview: /^\d{4}-\d{2}-\d{2}$/.test(str(v.nextReview, 10)) ? str(v.nextReview, 10) : '',
  }
}

/** Convierte datos desconocidos en una evaluación válida, o null si no son recuperables. */
export function parseEvaluation(v: unknown): Evaluation | null {
  if (!isRec(v) || !isRec(v.project)) return null
  const p = v.project
  const name = str(p.name, 300)
  if (!name.trim() && !str(p.description).trim()) return null

  const principles = emptyAssessments()
  if (isRec(v.principles)) {
    for (const id of PRINCIPLE_IDS) {
      const raw = (v.principles as Rec)[id]
      if (isRec(raw)) {
        const a: PrincipleAssessment = {
          status: pick(raw.status, STATUSES, 'no_evaluado'),
          notes: str(raw.notes),
          improvement: str(raw.improvement),
        }
        principles[id] = a
      }
    }
  }

  const now = new Date().toISOString()
  const createdAt = isIso(v.createdAt) ? v.createdAt : now
  const step = typeof v.currentStep === 'number' ? Math.min(5, Math.max(0, Math.floor(v.currentStep))) : 0

  return {
    id: str(v.id, 80) || uid('eval'),
    createdAt,
    updatedAt: isIso(v.updatedAt) ? v.updatedAt : createdAt,
    status: v.status === 'completada' ? 'completada' : 'borrador',
    currentStep: step,
    sourceCaseId: str(v.sourceCaseId, 80) || undefined,
    project: {
      name,
      type: pick<SystemType>(p.type, SYSTEM_VALUES, 'otro'),
      description: str(p.description),
      objective: str(p.objective),
      context: str(p.context),
    },
    groups: Array.isArray(v.groups) ? v.groups.map(parseGroup).filter((g): g is AffectedGroup => g !== null) : [],
    risks: Array.isArray(v.risks) ? v.risks.map(parseRisk).filter((r): r is Risk => r !== null) : [],
    principles,
    alternatives: Array.isArray(v.alternatives)
      ? v.alternatives.map(parseAlternative).filter((a): a is Alternative => a !== null)
      : [],
    decision: parseDecision(v.decision),
  }
}

export interface ImportResult {
  ok: boolean
  evaluations: Evaluation[]
  skipped: number
  error?: string
}

/** Valida el texto de una copia de seguridad. Nunca lanza excepciones. */
export function parseBackup(text: string): ImportResult {
  let data: unknown
  try {
    data = JSON.parse(text)
  } catch {
    return { ok: false, evaluations: [], skipped: 0, error: 'El archivo no es un JSON válido.' }
  }
  const list = Array.isArray(data) ? data : isRec(data) && Array.isArray(data.evaluations) ? data.evaluations : null
  if (!list) {
    return { ok: false, evaluations: [], skipped: 0, error: 'El archivo no contiene una lista de evaluaciones de ÉticaLab.' }
  }
  if (isRec(data) && data.app !== undefined && data.app !== 'eticalab') {
    return { ok: false, evaluations: [], skipped: 0, error: 'El archivo no parece una copia de seguridad de ÉticaLab.' }
  }
  const evaluations: Evaluation[] = []
  const seen = new Set<string>()
  let skipped = 0
  for (const item of list) {
    const ev = parseEvaluation(item)
    if (!ev) {
      skipped++
      continue
    }
    if (seen.has(ev.id)) ev.id = uid('eval')
    seen.add(ev.id)
    evaluations.push(ev)
  }
  if (evaluations.length === 0 && list.length > 0) {
    return { ok: false, evaluations: [], skipped, error: 'Ninguna evaluación del archivo tiene un formato válido.' }
  }
  return { ok: true, evaluations, skipped }
}

export function buildBackup(evaluations: Evaluation[]): BackupFile {
  return { app: 'eticalab', version: 1, exportedAt: new Date().toISOString(), evaluations }
}

export interface StepErrors {
  [field: string]: string
}

/** Validación por etapa. Las etapas 2 a 5 son orientativas y no bloquean el avance. */
export function validateProject(e: Evaluation): StepErrors {
  const errors: StepErrors = {}
  if (!e.project.name.trim()) errors.name = 'Escribe el nombre del proyecto.'
  if (!e.project.description.trim()) errors.description = 'Describe brevemente la solución.'
  if (!e.project.objective.trim()) errors.objective = 'Indica el objetivo principal.'
  return errors
}

export function validateDecision(e: Evaluation): StepErrors {
  const errors: StepErrors = {}
  const hasAlt = e.alternatives.some((a) => a.name.trim())
  if (hasAlt && !e.decision.chosenAlternativeId) errors.chosen = 'Elige la alternativa que adoptarás.'
  if (!e.decision.justification.trim()) errors.justification = 'Explica por qué tomas esta decisión.'
  return errors
}
