import { useNavigate, useParams, Link } from 'react-router-dom'
import { PlayCircle } from 'lucide-react'
import { CASE_BY_ID } from '../data/cases'
import { PRINCIPLE_BY_ID } from '../data/principles'
import { GROUP_LABEL, RISK_LABEL } from '../data/taxonomy'
import { EmptyState, SeverityBadge } from '../components/ui'
import ComparisonTable from '../components/ComparisonTable'
import { uid } from '../utils/id'

export default function CaseDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const c = id ? CASE_BY_ID[id] : undefined
  if (!c) {
    return (
      <EmptyState title="Caso no encontrado" text="Este caso no existe en la biblioteca.">
        <Link to="/casos" className="btn btn-primary">
          Ver casos
        </Link>
      </EmptyState>
    )
  }
  const alts = c.alternatives.map((a) => ({ ...a, id: uid('alt') }))

  return (
    <article className="max-w-4xl">
      <Link to="/casos" className="link text-sm">
        Volver a casos
      </Link>
      <p className="mt-4 text-sm font-semibold text-brand-deep">{c.tagline}</p>
      <h1 className="mt-1 text-3xl font-bold sm:text-4xl">{c.title}</h1>
      <p className="mt-3 rounded-lg bg-info-tint px-4 py-3 text-sm text-info">Caso educativo creado para ÉticaLab. No describe hechos reales ni se atribuye a ningún ponente.</p>

      <div className="mt-6 card flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink-soft">Crea una evaluación con los datos de este caso. Podrás editar todo y las valoraciones de principios empiezan sin evaluar.</p>
        <button type="button" className="btn btn-primary shrink-0" onClick={() => navigate(`/evaluaciones/nueva?caso=${c.id}`)}>
          <PlayCircle className="h-4 w-4" aria-hidden /> Usar como punto de partida
        </button>
      </div>

      <section className="mt-10" aria-labelledby="contexto">
        <h2 id="contexto" className="text-xl font-bold">Contexto</h2>
        <p className="mt-2">{c.context}</p>
      </section>
      <section className="mt-8" aria-labelledby="problema">
        <h2 id="problema" className="text-xl font-bold">Problema ético</h2>
        <p className="mt-2">{c.problem}</p>
      </section>

      <section className="mt-8" aria-labelledby="personas">
        <h2 id="personas" className="text-xl font-bold">Personas afectadas</h2>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2">
          {c.groups.map((g) => (
            <li key={g.name} className="rounded-xl border border-line bg-white p-4">
              <p className="font-semibold">{g.name}</p>
              <p className="text-xs text-ink-mute">{GROUP_LABEL[g.category]}</p>
              <p className="mt-1 text-sm text-ink-soft">{g.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8" aria-labelledby="principios-caso">
        <h2 id="principios-caso" className="text-xl font-bold">Principios implicados</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {c.principles.map((p) => (
            <li key={p} className="rounded-full bg-brand-tint px-3 py-1 text-sm font-semibold text-brand-deep">
              {PRINCIPLE_BY_ID[p].name}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8" aria-labelledby="riesgos-caso">
        <h2 id="riesgos-caso" className="text-xl font-bold">Riesgos</h2>
        <ul className="mt-3 space-y-3">
          {c.risks.map((r) => (
            <li key={r.description} className="rounded-xl border border-line bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold">{RISK_LABEL[r.category]}</p>
                <SeverityBadge severity={r.severity} />
              </div>
              <p className="mt-1">{r.description}</p>
              <p className="mt-2 text-sm text-ink-soft"><span className="font-semibold">Consecuencias:</span> {r.consequences}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8" aria-labelledby="alternativas-caso">
        <h2 id="alternativas-caso" className="mb-3 text-xl font-bold">Alternativas</h2>
        <ComparisonTable alternatives={alts} />
      </section>

      <section className="mt-8" aria-labelledby="medidas">
        <h2 id="medidas" className="text-xl font-bold">Medidas recomendadas</h2>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
          {c.measures.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      </section>

      <section className="mt-8" aria-labelledby="reflexion">
        <h2 id="reflexion" className="text-xl font-bold">Preguntas para la reflexión</h2>
        <ol className="mt-3 list-decimal space-y-1.5 pl-5">
          {c.questions.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ol>
      </section>

      <div className="mt-10">
        <button type="button" className="btn btn-primary" onClick={() => navigate(`/evaluaciones/nueva?caso=${c.id}`)}>
          <PlayCircle className="h-4 w-4" aria-hidden /> Usar como punto de partida
        </button>
      </div>
    </article>
  )
}
