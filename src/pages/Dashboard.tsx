import { Link } from 'react-router-dom'
import { ArrowRight, Grid3x3, Plus } from 'lucide-react'
import { CASES } from '../data/cases'
import { PRINCIPLES } from '../data/principles'
import { SYSTEM_TYPES } from '../types'
import { useEvaluations } from '../hooks/useEvaluations'
import { countDecisions, countRisks } from '../utils/analysis'
import { formatShort } from '../utils/dates'
import { EmptyState, EvalStatusBadge, PrincipleStrip, StripLegend } from '../components/ui'

const TYPE_LABEL = Object.fromEntries(SYSTEM_TYPES.map((t) => [t.value, t.label]))

export default function Dashboard() {
  const list = useEvaluations()
  const sorted = [...list].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  const recent = sorted.slice(0, 3)
  const attention = PRINCIPLES.map((p) => ({ p, n: list.filter((e) => e.principles[p.id].status === 'atencion').length }))

  const stats = [
    { label: 'Evaluaciones creadas', value: list.length },
    { label: 'Riesgos identificados', value: countRisks(list) },
    { label: 'Decisiones documentadas', value: countDecisions(list) },
  ]

  return (
    <div className="space-y-12">
      <section aria-labelledby="titulo-panel" className="max-w-3xl">
        <h1 id="titulo-panel" className="text-4xl font-bold leading-[1.1] sm:text-5xl">
          Evalúa las implicaciones éticas de tus decisiones tecnológicas
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-ink-soft">
          Identifica riesgos, reconoce a las personas afectadas y documenta soluciones responsables antes de llevarlas a producción.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/evaluaciones/nueva" className="btn btn-primary">
            <Plus className="h-4 w-4" aria-hidden /> Nueva evaluación ética
          </Link>
          <Link to="/matriz" className="btn btn-secondary">
            <Grid3x3 className="h-4 w-4" aria-hidden /> Matriz de evaluación
          </Link>
        </div>
      </section>

      <section aria-label="Indicadores">
        <dl className="grid gap-4 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="card p-5">
              <dd className="font-display text-4xl font-bold">{s.value}</dd>
              <dt className="mt-1 text-sm text-ink-soft">{s.label}</dt>
            </div>
          ))}
        </dl>
        <p className="mt-2 text-xs text-ink-mute">Se calculan con las evaluaciones guardadas en este navegador.</p>
      </section>

      {list.length === 0 ? (
        <EmptyState title="Todavía no tienes evaluaciones" text="Empieza desde cero o abre uno de los casos educativos y edítalo como punto de partida.">
          <Link to="/evaluaciones/nueva" className="btn btn-primary">
            <Plus className="h-4 w-4" aria-hidden /> Nueva evaluación ética
          </Link>
          <Link to="/casos" className="btn btn-secondary">
            Explorar casos prácticos
          </Link>
          <ul className="mt-2 flex w-full flex-col items-center gap-1 text-sm">
            {CASES.slice(0, 3).map((c) => (
              <li key={c.id}>
                <Link to={`/casos/${c.id}`} className="link">
                  {c.tagline}
                </Link>
              </li>
            ))}
          </ul>
        </EmptyState>
      ) : (
        <>
          <section aria-labelledby="recientes">
            <div className="mb-4 flex items-end justify-between gap-4">
              <h2 id="recientes" className="text-2xl font-bold">
                Evaluaciones recientes
              </h2>
              <Link to="/evaluaciones" className="link inline-flex items-center gap-1 text-sm">
                Ver todas <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
            <ul className="grid gap-4 lg:grid-cols-3">
              {recent.map((e) => (
                <li key={e.id} className="card flex flex-col p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-semibold leading-snug">
                      <Link to={`/evaluaciones/${e.id}`} className="hover:underline">
                        {e.project.name || 'Sin nombre'}
                      </Link>
                    </h3>
                    <EvalStatusBadge status={e.status} />
                  </div>
                  <p className="mt-1 text-sm text-ink-mute">
                    {TYPE_LABEL[e.project.type]} · {formatShort(e.updatedAt)}
                  </p>
                  <div className="mt-4">
                    <PrincipleStrip evaluation={e} size="sm" />
                  </div>
                  <p className="mt-3 text-sm text-ink-soft">
                    {e.risks.filter((r) => r.description.trim()).length} riesgos · {e.alternatives.filter((a) => a.name.trim()).length} alternativas
                  </p>
                  <Link to={e.status === 'completada' ? `/evaluaciones/${e.id}` : `/evaluaciones/${e.id}/editar`} className="link mt-auto pt-4 text-sm">
                    {e.status === 'completada' ? 'Abrir informe' : 'Continuar evaluación'}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-3">
              <StripLegend />
            </div>
          </section>

          <section aria-labelledby="actividad">
            <h2 id="actividad" className="mb-4 text-2xl font-bold">
              Actividad reciente
            </h2>
            <ul className="card divide-y divide-line">
              {sorted.slice(0, 5).map((e) => (
                <li key={e.id} className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 text-sm">
                  <span>
                    <Link to={`/evaluaciones/${e.id}`} className="font-semibold hover:underline">
                      {e.project.name || 'Sin nombre'}
                    </Link>{' '}
                    <span className="text-ink-soft">{e.status === 'completada' ? 'evaluación completada' : 'borrador guardado'}</span>
                  </span>
                  <time dateTime={e.updatedAt} className="text-ink-mute">
                    {formatShort(e.updatedAt)}
                  </time>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      <section aria-labelledby="principios">
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2 id="principios" className="text-2xl font-bold">
            Los diez principios que evalúa ÉticaLab
          </h2>
          <Link to="/matriz" className="link inline-flex items-center gap-1 text-sm">
            Abrir la matriz <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {attention.map(({ p, n }) => (
            <li key={p.id} className="rounded-xl border border-line bg-white p-4">
              <h3 className="text-[15px] font-semibold">{p.name}</h3>
              <p className="mt-1 text-sm text-ink-soft">{p.description}</p>
              {n > 0 && (
                <p className="mt-2 inline-block rounded-full bg-warn-tint px-2.5 py-0.5 text-xs font-semibold text-warn">
                  Requiere atención en {n} {n === 1 ? 'evaluación' : 'evaluaciones'}
                </p>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
