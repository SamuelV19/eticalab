import { Plus, Trash2 } from 'lucide-react'
import { PRINCIPLES } from '../../data/principles'
import type { Alternative, PrincipleId } from '../../types'
import { newAlternative } from '../../utils/factory'
import ComparisonTable from '../ComparisonTable'
import { TextArea, TextField } from '../ui'
import type { StepProps } from './types'

const MAX = 4

export default function AlternativesStep({ ev, update }: StepProps) {
  const patch = (id: string, p: Partial<Alternative>) => update({ alternatives: ev.alternatives.map((a) => (a.id === id ? { ...a, ...p } : a)) })
  const remove = (id: string) => {
    const wasChosen = ev.decision.chosenAlternativeId === id
    update({
      alternatives: ev.alternatives.filter((a) => a.id !== id),
      ...(wasChosen ? { decision: { ...ev.decision, chosenAlternativeId: '' } } : {}),
    })
  }
  const toggle = (a: Alternative, pid: PrincipleId) =>
    patch(a.id, { principles: a.principles.includes(pid) ? a.principles.filter((x) => x !== pid) : [...a.principles, pid] })

  return (
    <div className="space-y-6">
      <p className="text-sm text-ink-soft">Registra al menos dos formas posibles de resolver el problema, incluida la que hoy te parece más conveniente.</p>
      <ul className="space-y-4">
        {ev.alternatives.map((a, i) => (
          <li key={a.id} className="card p-5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-base font-semibold">Alternativa {i + 1}</h3>
              {ev.alternatives.length > 1 && (
                <button type="button" className="btn btn-ghost btn-sm text-risk" onClick={() => remove(a.id)} aria-label={`Eliminar alternativa ${i + 1}${a.name ? `: ${a.name}` : ''}`}>
                  <Trash2 className="h-4 w-4" aria-hidden /> Eliminar
                </button>
              )}
            </div>
            <div className="mt-3 space-y-4">
              <TextField label="Nombre de la alternativa" value={a.name} onChange={(v) => patch(a.id, { name: v })} />
              <TextArea label="Descripción" value={a.description} onChange={(v) => patch(a.id, { description: v })} rows={2} />
              <div className="grid gap-4 md:grid-cols-2">
                <TextArea label="Beneficios esperados" value={a.benefits} onChange={(v) => patch(a.id, { benefits: v })} rows={2} />
                <TextArea label="Riesgos" value={a.risks} onChange={(v) => patch(a.id, { risks: v })} rows={2} />
                <TextArea label="Personas afectadas" value={a.affected} onChange={(v) => patch(a.id, { affected: v })} rows={2} />
                <TextArea label="Limitaciones" value={a.limitations} onChange={(v) => patch(a.id, { limitations: v })} rows={2} />
              </div>
              <TextArea label="Medidas de mitigación" value={a.mitigation} onChange={(v) => patch(a.id, { mitigation: v })} rows={2} />
              <fieldset>
                <legend className="mb-2 text-sm font-semibold">Principios que favorece</legend>
                <div className="flex flex-wrap gap-2">
                  {PRINCIPLES.map((p) => {
                    const on = a.principles.includes(p.id)
                    return (
                      <label
                        key={p.id}
                        className={`flex min-h-[40px] cursor-pointer items-center rounded-full border px-3 text-sm font-semibold has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink ${
                          on ? 'border-brand bg-brand-tint text-brand-deep' : 'border-line-strong bg-white text-ink-soft hover:bg-[#F6F3EC]'
                        }`}
                      >
                        <input type="checkbox" className="sr-only" checked={on} onChange={() => toggle(a, p.id)} />
                        {p.short}
                      </label>
                    )
                  })}
                </div>
              </fieldset>
            </div>
          </li>
        ))}
      </ul>
      {ev.alternatives.length < MAX && (
        <button type="button" className="btn btn-secondary" onClick={() => update({ alternatives: [...ev.alternatives, newAlternative()] })}>
          <Plus className="h-4 w-4" aria-hidden /> Añadir alternativa
        </button>
      )}

      <section className="card p-5" aria-labelledby="comparacion">
        <h3 id="comparacion" className="text-lg font-semibold">
          Comparación
        </h3>
        <p className="mb-4 mt-1 text-sm text-ink-soft">Se actualiza a medida que completas las alternativas con nombre.</p>
        <ComparisonTable alternatives={ev.alternatives} />
      </section>
    </div>
  )
}
