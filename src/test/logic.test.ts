import { beforeEach, describe, expect, it } from 'vitest'
import { CASES, evaluationFromCase } from '../data/cases'
import { PRINCIPLES } from '../data/principles'
import { TRACEABILITY } from '../data/traceability'
import { summarize, countDecisions, countRisks } from '../utils/analysis'
import { newEvaluation } from '../utils/factory'
import {
  STORAGE_KEY,
  _invalidateCache,
  deleteEvaluation,
  getEvaluations,
  mergeEvaluations,
  replaceAll,
  resetAll,
  saveEvaluation,
} from '../utils/storage'
import { buildBackup, parseBackup, parseEvaluation, validateDecision, validateProject } from '../utils/validation'

beforeEach(() => {
  localStorage.clear()
  _invalidateCache()
})

describe('datos del proyecto', () => {
  it('define diez principios con preguntas y recomendaciones', () => {
    expect(PRINCIPLES).toHaveLength(10)
    PRINCIPLES.forEach((p) => {
      expect(p.questions.length).toBeGreaterThanOrEqual(3)
      expect(p.recommendations.length).toBeGreaterThanOrEqual(2)
    })
  })
  it('incluye al menos seis casos completos', () => {
    expect(CASES.length).toBeGreaterThanOrEqual(6)
    CASES.forEach((c) => {
      expect(c.groups.length).toBeGreaterThan(0)
      expect(c.risks.length).toBeGreaterThan(0)
      expect(c.alternatives.length).toBeGreaterThanOrEqual(2)
      expect(c.measures.length).toBeGreaterThan(0)
      expect(c.questions.length).toBeGreaterThan(0)
    })
  })
  it('la matriz de trazabilidad cubre las ocho temáticas', () => {
    expect(TRACEABILITY).toHaveLength(8)
  })
  it('un caso se convierte en una evaluación editable sin valoraciones asumidas', () => {
    const ev = evaluationFromCase(CASES[0])
    expect(ev.project.name).toContain('Caso:')
    expect(ev.sourceCaseId).toBe(CASES[0].id)
    expect(Object.values(ev.principles).every((p) => p.status === 'no_evaluado')).toBe(true)
    expect(ev.status).toBe('borrador')
  })
})

describe('persistencia', () => {
  it('guarda, actualiza y elimina evaluaciones', () => {
    const ev = newEvaluation({ project: { name: 'A', type: 'web', description: 'd', objective: 'o', context: '' } })
    expect(getEvaluations()).toHaveLength(0)
    saveEvaluation(ev)
    expect(getEvaluations()).toHaveLength(1)
    saveEvaluation({ ...ev, project: { ...ev.project, name: 'B' } })
    expect(getEvaluations()).toHaveLength(1)
    expect(getEvaluations()[0].project.name).toBe('B')
    deleteEvaluation(ev.id)
    expect(getEvaluations()).toHaveLength(0)
  })
  it('sobrevive a una recarga (relectura desde localStorage)', () => {
    saveEvaluation(newEvaluation({ project: { name: 'Persistente', type: 'ia', description: 'd', objective: 'o', context: '' } }))
    _invalidateCache()
    expect(getEvaluations()[0].project.name).toBe('Persistente')
  })
  it('ignora datos corruptos sin romperse', () => {
    localStorage.setItem(STORAGE_KEY, '{no es json')
    _invalidateCache()
    expect(getEvaluations()).toEqual([])
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ x: 1 }))
    _invalidateCache()
    expect(getEvaluations()).toEqual([])
  })
  it('descarta entradas inválidas pero conserva las válidas', () => {
    const ok = newEvaluation({ project: { name: 'Válida', type: 'web', description: 'd', objective: 'o', context: '' } })
    localStorage.setItem(STORAGE_KEY, JSON.stringify([ok, 42, null, { project: 7 }]))
    _invalidateCache()
    expect(getEvaluations()).toHaveLength(1)
  })
  it('combina, reemplaza y restablece', () => {
    const a = newEvaluation({ project: { name: 'A', type: 'web', description: 'd', objective: 'o', context: '' } })
    const b = newEvaluation({ project: { name: 'B', type: 'web', description: 'd', objective: 'o', context: '' } })
    replaceAll([a])
    mergeEvaluations([b])
    expect(getEvaluations()).toHaveLength(2)
    replaceAll([b])
    expect(getEvaluations()).toHaveLength(1)
    resetAll()
    expect(getEvaluations()).toHaveLength(0)
  })
})

describe('importación y exportación', () => {
  const mk = (name: string) => newEvaluation({ project: { name, type: 'ia', description: 'd', objective: 'o', context: 'c' } })
  it('hace un viaje de ida y vuelta sin perder datos', () => {
    const ev = evaluationFromCase(CASES[2])
    ev.principles.transparencia = { status: 'atencion', notes: 'n', improvement: 'm' }
    const res = parseBackup(JSON.stringify(buildBackup([ev])))
    expect(res.ok).toBe(true)
    expect(res.evaluations[0]).toEqual(ev)
  })
  it('rechaza JSON inválido', () => {
    const res = parseBackup('esto no es json')
    expect(res.ok).toBe(false)
    expect(res.error).toMatch(/JSON/)
  })
  it('rechaza archivos de otra aplicación o con otra forma', () => {
    expect(parseBackup(JSON.stringify({ app: 'otra', evaluations: [] })).ok).toBe(false)
    expect(parseBackup(JSON.stringify({ hola: 'mundo' })).ok).toBe(false)
    expect(parseBackup('"texto"').ok).toBe(false)
  })
  it('omite registros malformados y normaliza valores desconocidos', () => {
    const good = mk('Buena')
    const weird = { ...mk('Rara'), status: 'otro', project: { name: 'Rara', type: 'inventado', description: 'd', objective: 'o', context: 'c' }, principles: { dignidad: { status: 'xyz', notes: 5 } } }
    const res = parseBackup(JSON.stringify({ app: 'eticalab', evaluations: [good, weird, 'basura', { project: null }] }))
    expect(res.ok).toBe(true)
    expect(res.evaluations).toHaveLength(2)
    expect(res.skipped).toBe(2)
    const r = res.evaluations[1]
    expect(r.project.type).toBe('otro')
    expect(r.status).toBe('borrador')
    expect(r.principles.dignidad.status).toBe('no_evaluado')
    expect(r.principles.dignidad.notes).toBe('')
  })
  it('regenera identificadores duplicados', () => {
    const a = mk('A')
    const res = parseBackup(JSON.stringify([a, { ...mk('B'), id: a.id }]))
    expect(new Set(res.evaluations.map((e) => e.id)).size).toBe(2)
  })
  it('parseEvaluation no acepta evaluaciones vacías', () => {
    expect(parseEvaluation({ project: { name: '', description: '' } })).toBeNull()
  })
})

describe('validación del formulario', () => {
  it('exige nombre, descripción y objetivo', () => {
    const e = newEvaluation()
    expect(Object.keys(validateProject(e)).sort()).toEqual(['description', 'name', 'objective'])
    e.project = { ...e.project, name: 'x', description: 'y', objective: 'z' }
    expect(validateProject(e)).toEqual({})
  })
  it('exige alternativa elegida y justificación al finalizar', () => {
    const e = newEvaluation()
    e.alternatives[0].name = 'Opción 1'
    expect(Object.keys(validateDecision(e)).sort()).toEqual(['chosen', 'justification'])
    e.decision.chosenAlternativeId = e.alternatives[0].id
    e.decision.justification = 'porque sí'
    expect(validateDecision(e)).toEqual({})
  })
})

describe('análisis', () => {
  it('detecta vacíos sin emitir un veredicto ético', () => {
    const e = evaluationFromCase(CASES[1])
    const s = summarize(e)
    expect(s.counts.no_evaluado).toBe(10)
    expect(s.riskCount).toBe(CASES[1].risks.length)
    expect(s.findings.some((f) => /no se ha evaluado/.test(f.text))).toBe(true)
    expect(JSON.stringify(s)).not.toMatch(/es ético|no es ético|puntaje|score/i)
  })
  it('marca principios que requieren atención sin medida de mejora', () => {
    const e = newEvaluation()
    e.principles.justicia.status = 'atencion'
    expect(summarize(e).findings.some((f) => f.level === 'alerta' && /Justicia/.test(f.text))).toBe(true)
    e.principles.justicia.improvement = 'Auditar sesgos'
    expect(summarize(e).findings.some((f) => /Justicia/.test(f.text) && /medida de mejora/.test(f.text))).toBe(false)
  })
  it('los indicadores salen de los datos reales', () => {
    expect(countRisks([])).toBe(0)
    expect(countDecisions([])).toBe(0)
    const e = evaluationFromCase(CASES[0])
    expect(countRisks([e])).toBe(CASES[0].risks.length)
    expect(countDecisions([e])).toBe(0)
    e.decision.chosenAlternativeId = e.alternatives[0].id
    e.decision.justification = 'j'
    expect(countDecisions([e])).toBe(1)
  })
})
