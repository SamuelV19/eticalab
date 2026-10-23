export type SystemType = 'web' | 'movil' | 'informacion' | 'ia' | 'agente' | 'datos' | 'otro'

export const SYSTEM_TYPES: { value: SystemType; label: string }[] = [
  { value: 'web', label: 'Aplicación web' },
  { value: 'movil', label: 'Aplicación móvil' },
  { value: 'informacion', label: 'Sistema de información' },
  { value: 'ia', label: 'Sistema de inteligencia artificial' },
  { value: 'agente', label: 'Agente autónomo' },
  { value: 'datos', label: 'Plataforma de datos' },
  { value: 'otro', label: 'Otro' },
]

export type PrincipleId =
  | 'dignidad'
  | 'privacidad'
  | 'justicia'
  | 'transparencia'
  | 'autonomia'
  | 'responsabilidad'
  | 'cuidado'
  | 'inclusion'
  | 'confianza'
  | 'supervision'

export type PrincipleStatus = 'cumplido' | 'atencion' | 'no_evaluado'

export type GroupCategory =
  | 'usuarios'
  | 'datos'
  | 'vulnerables'
  | 'comunidades'
  | 'administradores'
  | 'terceros'

export type RiskCategory =
  | 'privacidad'
  | 'discriminacion'
  | 'transparencia'
  | 'manipulacion'
  | 'exclusion'
  | 'conflictos'
  | 'supervision'
  | 'dano'
  | 'automatizacion'

export type Severity = 'baja' | 'media' | 'alta'

export type EvaluationStatus = 'borrador' | 'completada'

export interface ProjectInfo {
  name: string
  type: SystemType
  description: string
  objective: string
  context: string
}

export interface AffectedGroup {
  id: string
  category: GroupCategory
  name: string
  description: string
}

export interface Risk {
  id: string
  category: RiskCategory
  description: string
  affected: string
  consequences: string
  preventive: string
  severity: Severity
}

export interface PrincipleAssessment {
  status: PrincipleStatus
  notes: string
  improvement: string
}

export interface Alternative {
  id: string
  name: string
  description: string
  benefits: string
  risks: string
  affected: string
  principles: PrincipleId[]
  limitations: string
  mitigation: string
}

export interface Decision {
  chosenAlternativeId: string
  justification: string
  acceptedRisks: string
  actions: string
  reviewer: string
  nextReview: string
}

export interface Evaluation {
  id: string
  createdAt: string
  updatedAt: string
  status: EvaluationStatus
  currentStep: number
  sourceCaseId?: string
  project: ProjectInfo
  groups: AffectedGroup[]
  risks: Risk[]
  principles: Record<PrincipleId, PrincipleAssessment>
  alternatives: Alternative[]
  decision: Decision
}

export interface BackupFile {
  app: 'eticalab'
  version: 1
  exportedAt: string
  evaluations: Evaluation[]
}
