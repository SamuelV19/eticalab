import { Plus, Trash2 } from 'lucide-react'
import { RISK_CATEGORIES } from '../../data/taxonomy'
import { SEVERITIES } from '../../data/taxonomy'
import type { RiskCategory, Severity } from '../../types'
import { newRisk } from '../../utils/factory'
import { SelectField, TextArea, TextField } from '../ui'
import type { StepProps } from './types'

export default function RisksStep({ ev, update }: StepProps) {
  const add = (category: RiskCategory) => update({ risks: [...ev.risks, newRisk({ category })] })
  const patch = (id: string, p: Partial<(typeof ev.risks)[number]>) => update({ risks: ev.risks.map((r) => (r.id === id ? { ...r, ...p } : r)) })
  const remove = (id: string) => update({ risks: ev.risks.filter((r) => r.id !== id) })

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold">Elige una categoría para registrar un riesgo</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {RISK_CATEGORIES.map((c) => (
            <button key={c.value} type="button" className="btn btn-secondary btn-sm" onClick={() => add(c.value)} title={c.hint}>
              <Plus className="h-3.5 w-3.5" aria-hidden /> {c.label}
            </button>
          ))}
        </div>
      </div>

      {ev.risks.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line-strong bg-white/60 p-6 text-center text-sm text-ink-soft">
          Aún no registraste riesgos. Si crees que no hay ninguno, repasa las categorías: suele haber más de uno.
        </p>
      ) : (
        <ul className="space-y-4">
          {ev.risks.map((r, i) => {
            const cat = RISK_CATEGORIES.find((c) => c.value === r.category)
            return (
              <li key={r.id} className="card p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-semibold">Riesgo {i + 1}</h3>
                  <button type="button" className="btn btn-ghost btn-sm text-risk" onClick={() => remove(r.id)} aria-label={`Eliminar riesgo ${i + 1}`}>
                    <Trash2 className="h-4 w-4" aria-hidden /> Eliminar
                  </button>
                </div>
                <div className="mt-3 grid gap-4 md:grid-cols-2">
                  <SelectField label="Categoría" value={r.category} onChange={(v) => patch(r.id, { category: v as RiskCategory })} options={RISK_CATEGORIES} hint={cat?.hint} />
                  <SelectField label="Severidad estimada" value={r.severity} onChange={(v) => patch(r.id, { severity: v as Severity })} options={SEVERITIES} />
                </div>
                <div className="mt-4 space-y-4">
                  <TextArea label="Descripción del riesgo" value={r.description} onChange={(v) => patch(r.id, { description: v })} rows={2} />
                  <TextField label="¿A quién afecta?" value={r.affected} onChange={(v) => patch(r.id, { affected: v })} />
                  <TextArea label="Posibles consecuencias" value={r.consequences} onChange={(v) => patch(r.id, { consequences: v })} rows={2} />
                  <TextArea label="Medidas preventivas" value={r.preventive} onChange={(v) => patch(r.id, { preventive: v })} rows={2} hint="¿Qué harás para evitarlo o reducirlo?" />
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
