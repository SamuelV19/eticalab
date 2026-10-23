import { PRINCIPLE_IDS } from '../data/principles'
import type { Alternative, AffectedGroup, Decision, Evaluation, PrincipleAssessment, PrincipleId, Risk } from '../types'
import { uid } from './id'

export function emptyAssessments(): Record<PrincipleId, PrincipleAssessment> {
  return Object.fromEntries(
    PRINCIPLE_IDS.map((id) => [id, { status: 'no_evaluado', notes: '', improvement: '' }]),
  ) as Record<PrincipleId, PrincipleAssessment>
}

export function emptyDecision(): Decision {
  return { chosenAlternativeId: '', justification: '', acceptedRisks: '', actions: '', reviewer: '', nextReview: '' }
}

export function newGroup(partial: Partial<AffectedGroup> = {}): AffectedGroup {
  return { id: uid('grp'), category: 'usuarios', name: '', description: '', ...partial }
}

export function newRisk(partial: Partial<Risk> = {}): Risk {
  return {
    id: uid('rsk'),
    category: 'privacidad',
    description: '',
    affected: '',
    consequences: '',
    preventive: '',
    severity: 'media',
    ...partial,
  }
}

export function newAlternative(partial: Partial<Alternative> = {}): Alternative {
  return {
    id: uid('alt'),
    name: '',
    description: '',
    benefits: '',
    risks: '',
    affected: '',
    principles: [],
    limitations: '',
    mitigation: '',
    ...partial,
  }
}

export function newEvaluation(partial: Partial<Evaluation> = {}): Evaluation {
  const now = new Date().toISOString()
  return {
    id: uid('eval'),
    createdAt: now,
    updatedAt: now,
    status: 'borrador',
    currentStep: 0,
    project: { name: '', type: 'web', description: '', objective: '', context: '' },
    groups: [],
    risks: [],
    principles: emptyAssessments(),
    alternatives: [newAlternative(), newAlternative()],
    decision: emptyDecision(),
    ...partial,
  }
}
