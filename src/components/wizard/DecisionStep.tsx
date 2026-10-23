import { summarize } from '../../utils/analysis'
import { PrincipleStrip, SelectField, TextArea, TextField } from '../ui'
import FindingsList from '../FindingsList'
import type { StepProps } from './types'

export default function DecisionStep({ ev, update, errors }: StepProps) {
  const d = ev.decision
  const set = (patch: Partial<typeof d>) => update({ decision: { ...d, ...patch } })
  const named = ev.alternatives.filter((a) => a.name.trim())
  const summary = summarize(ev)

  return (
    <div className="space-y-6">
      <div className="space-y-5">
        <SelectField
          label="Alternativa elegida"
          value={d.chosenAlternativeId}
          onChange={(v) => set({ chosenAlternativeId: v })}
          required={named.length > 0}
          error={errors.chosen}
          options={[{ value: '', label: named.length ? 'Selecciona una alternativa' : 'No hay alternativas con nombre' }, ...named.map((a) => ({ value: a.id, label: a.name }))]}
        />
        <TextArea label="Justificación" value={d.justification} onChange={(v) => set({ justification: v })} required error={errors.justification} rows={4} hint="¿Por qué esta alternativa y no las otras? ¿Qué intereses o limitaciones influyeron?" />
        <TextArea label="Riesgos aceptados o pendientes" value={d.acceptedRisks} onChange={(v) => set({ acceptedRisks: v })} rows={3} hint="¿Qué riesgos se asumen conscientemente y cuáles quedan sin resolver?" />
        <TextArea label="Acciones preventivas" value={d.actions} onChange={(v) => set({ actions: v })} rows={3} />
        <div className="grid gap-5 md:grid-cols-2">
          <TextField label="Responsable de revisar las medidas" value={d.reviewer} onChange={(v) => set({ reviewer: v })} />
          <TextField label="Próxima revisión" type="date" value={d.nextReview} onChange={(v) => set({ nextReview: v })} />
        </div>
      </div>

      <section className="card p-5" aria-labelledby="resumen-previo">
        <h3 id="resumen-previo" className="text-lg font-semibold">
          Resumen antes de finalizar
        </h3>
        <p className="mb-4 mt-1 text-sm text-ink-soft">
          {summary.riskCount} riesgos · {summary.namedAlternatives} alternativas · {summary.evaluated} de {summary.total} principios valorados. Este resumen señala vacíos de documentación; no indica si el proyecto es ético.
        </p>
        <PrincipleStrip evaluation={ev} />
        <div className="mt-4">
          <FindingsList findings={summary.findings} />
        </div>
      </section>
    </div>
  )
}
