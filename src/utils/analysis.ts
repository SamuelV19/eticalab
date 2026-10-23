import { PRINCIPLES } from '../data/principles'
import { RISK_CATEGORIES, RISK_LABEL } from '../data/taxonomy'
import type { Evaluation, PrincipleId } from '../types'

export interface Finding {
  level: 'alerta' | 'aviso'
  text: string
}

export interface Summary {
  counts: { cumplido: number; atencion: number; no_evaluado: number }
  evaluated: number
  total: number
  riskCount: number
  highRisks: number
  risksWithoutMeasure: number
  namedAlternatives: number
  findings: Finding[]
}

/**
 * Resume el estado de una evaluación y detecta vacíos o inconsistencias.
 * No calcula una puntuación ética: solo señala dónde falta criterio o documentación.
 */
export function summarize(e: Evaluation): Summary {
  const counts = { cumplido: 0, atencion: 0, no_evaluado: 0 }
  for (const p of PRINCIPLES) counts[e.principles[p.id].status]++

  const risks = e.risks.filter((r) => r.description.trim())
  const risksWithoutMeasure = risks.filter((r) => !r.preventive.trim()).length
  const highRisks = risks.filter((r) => r.severity === 'alta').length
  const namedAlternatives = e.alternatives.filter((a) => a.name.trim()).length
  const findings: Finding[] = []

  if (risks.length === 0) {
    findings.push({ level: 'aviso', text: 'No se registró ningún riesgo. Revisa si realmente no hay riesgos o si falta analizarlos.' })
  }
  if (e.groups.filter((g) => g.name.trim()).length === 0) {
    findings.push({ level: 'aviso', text: 'No se identificaron personas o grupos afectados.' })
  }
  if (risksWithoutMeasure > 0) {
    findings.push({
      level: 'alerta',
      text: `${risksWithoutMeasure} ${risksWithoutMeasure === 1 ? 'riesgo no tiene' : 'riesgos no tienen'} medidas preventivas definidas.`,
    })
  }

  // Riesgos que apuntan a principios que no se han evaluado o requieren atención sin medida de mejora.
  const flagged = new Set<PrincipleId>()
  for (const r of risks) {
    const cat = RISK_CATEGORIES.find((c) => c.value === r.category)
    cat?.principles.forEach((pid) => {
      if (e.principles[pid].status === 'no_evaluado') flagged.add(pid)
    })
  }
  flagged.forEach((pid) => {
    const name = PRINCIPLES.find((p) => p.id === pid)?.name ?? pid
    findings.push({ level: 'aviso', text: `Hay riesgos relacionados con «${name}», pero ese principio aún no se ha evaluado.` })
  })

  for (const p of PRINCIPLES) {
    const a = e.principles[p.id]
    if (a.status === 'atencion' && !a.improvement.trim()) {
      findings.push({ level: 'alerta', text: `«${p.name}» requiere atención y todavía no tiene medida de mejora.` })
    }
  }

  const usedCats = new Set(risks.map((r) => r.category))
  if (e.principles.privacidad.status === 'cumplido' && usedCats.has('privacidad')) {
    findings.push({
      level: 'aviso',
      text: `Marcaste «Privacidad» como cumplido y también registraste un riesgo de «${RISK_LABEL.privacidad}». Confirma que las medidas lo cubren.`,
    })
  }

  if (namedAlternatives < 2) {
    findings.push({ level: 'aviso', text: 'Solo hay una alternativa (o ninguna). Comparar al menos dos ayuda a justificar la decisión.' })
  }

  const chosen = e.alternatives.find((a) => a.id === e.decision.chosenAlternativeId)
  if (!chosen && namedAlternatives > 0) {
    findings.push({ level: 'alerta', text: 'No se eligió una alternativa en la decisión final.' })
  }
  if (!e.decision.justification.trim()) findings.push({ level: 'alerta', text: 'La decisión final no tiene justificación.' })
  if (!e.decision.reviewer.trim()) findings.push({ level: 'aviso', text: 'No se indicó quién revisará las medidas.' })
  if (highRisks > 0 && !e.decision.acceptedRisks.trim()) {
    findings.push({ level: 'aviso', text: 'Hay riesgos de severidad alta y la decisión no menciona riesgos aceptados o pendientes.' })
  }

  return {
    counts,
    evaluated: counts.cumplido + counts.atencion,
    total: PRINCIPLES.length,
    riskCount: risks.length,
    highRisks,
    risksWithoutMeasure,
    namedAlternatives,
    findings,
  }
}

export function countDecisions(list: Evaluation[]): number {
  return list.filter((e) => e.decision.justification.trim() && e.decision.chosenAlternativeId).length
}

export function countRisks(list: Evaluation[]): number {
  return list.reduce((n, e) => n + e.risks.filter((r) => r.description.trim()).length, 0)
}
