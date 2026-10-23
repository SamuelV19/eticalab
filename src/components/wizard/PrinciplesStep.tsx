import { PRINCIPLES } from '../../data/principles'
import PrincipleAssessor from '../PrincipleAssessor'
import { PrincipleStrip, StripLegend } from '../ui'
import type { StepProps } from './types'

export default function PrinciplesStep({ ev, update }: StepProps) {
  const done = PRINCIPLES.filter((p) => ev.principles[p.id].status !== 'no_evaluado').length
  return (
    <div className="space-y-6">
      <div className="card p-5">
        <p className="text-sm font-semibold">
          {done} de {PRINCIPLES.length} principios valorados
        </p>
        <div className="mt-3">
          <PrincipleStrip evaluation={ev} size="md" />
        </div>
        <div className="mt-3">
          <StripLegend />
        </div>
        <p className="mt-3 text-xs text-ink-mute">Es un avance de tu trabajo, no una calificación del proyecto. Las valoraciones son autoevaluaciones y requieren criterio humano.</p>
      </div>
      {PRINCIPLES.map((p) => (
        <PrincipleAssessor key={p.id} principle={p} value={ev.principles[p.id]} onChange={(v) => update({ principles: { ...ev.principles, [p.id]: v } })} />
      ))}
    </div>
  )
}
