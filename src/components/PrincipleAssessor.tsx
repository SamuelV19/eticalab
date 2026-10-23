import { PRINCIPLES, type PrincipleDef } from '../data/principles'
import { STATUS_LABEL } from '../data/taxonomy'
import type { PrincipleAssessment, PrincipleStatus } from '../types'
import { StatusIcon, TextArea } from './ui'

const OPTIONS: PrincipleStatus[] = ['cumplido', 'atencion', 'no_evaluado']

const ACTIVE: Record<PrincipleStatus, string> = {
  cumplido: 'border-ok bg-ok-tint text-ok',
  atencion: 'border-warn-bar bg-warn-tint text-warn',
  no_evaluado: 'border-ink-mute bg-[#EFEDE8] text-ink',
}

interface Props {
  principle: PrincipleDef
  value: PrincipleAssessment
  onChange: (v: PrincipleAssessment) => void
}

export default function PrincipleAssessor({ principle, value, onChange }: Props) {
  const name = `estado-${principle.id}`
  return (
    <section className="card p-5 sm:p-6" aria-labelledby={`p-${principle.id}`}>
      <h3 id={`p-${principle.id}`} className="text-lg font-semibold">
        {principle.name}
      </h3>
      <p className="mt-1 text-sm text-ink-soft">{principle.description}</p>

      <div className="mt-4">
        <p className="text-sm font-semibold">Preguntas para orientar tu valoración</p>
        <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm text-ink-soft">
          {principle.questions.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ul>
      </div>

      <fieldset className="mt-5">
        <legend className="mb-2 text-sm font-semibold">Tu valoración (autoevaluación)</legend>
        <div className="grid gap-2 sm:grid-cols-3">
          {OPTIONS.map((s) => {
            const active = value.status === s
            return (
              <label
                key={s}
                className={`flex min-h-[44px] cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink ${
                  active ? ACTIVE[s] : 'border-line-strong bg-white text-ink-soft hover:bg-[#F6F3EC]'
                }`}
              >
                <input type="radio" name={name} value={s} checked={active} onChange={() => onChange({ ...value, status: s })} className="sr-only" />
                <StatusIcon status={s} />
                {STATUS_LABEL[s]}
              </label>
            )
          })}
        </div>
        <p className="mt-2 text-xs text-ink-mute">Es tu criterio como profesional. Marcar «cumplido» no certifica que el principio se cumpla.</p>
      </fieldset>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <TextArea label="Observaciones" value={value.notes} onChange={(v) => onChange({ ...value, notes: v })} hint="¿En qué te basas para esta valoración?" />
        <TextArea label="Medidas de mejora" value={value.improvement} onChange={(v) => onChange({ ...value, improvement: v })} hint={value.status === 'atencion' ? 'Este principio requiere atención: define qué harás.' : 'Qué harías para fortalecerlo.'} />
      </div>

      <details className="mt-4 rounded-lg bg-[#F8F5EE] px-4 py-3 text-sm">
        <summary className="cursor-pointer font-semibold">Ideas de mejora frecuentes</summary>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-ink-soft">
          {principle.recommendations.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </details>
    </section>
  )
}

export { PRINCIPLES }
