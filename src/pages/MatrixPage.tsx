import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { PRINCIPLES } from '../data/principles'
import { useEvaluations } from '../hooks/useEvaluations'
import { useToast } from '../components/Toast'
import PrincipleAssessor from '../components/PrincipleAssessor'
import { EmptyState, PageHeader, PrincipleStrip, SelectField, StatusBadge, StripLegend } from '../components/ui'
import type { PrincipleAssessment, PrincipleId, PrincipleStatus } from '../types'
import { saveEvaluation } from '../utils/storage'
import { summarize } from '../utils/analysis'

type Filter = 'todos' | PrincipleStatus

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'atencion', label: 'Requieren atención' },
  { value: 'no_evaluado', label: 'No evaluados' },
  { value: 'cumplido', label: 'Cumplidos (autoevaluación)' },
]

export default function MatrixPage() {
  const list = useEvaluations()
  const toast = useToast()
  const [params, setParams] = useSearchParams()
  const [filter, setFilter] = useState<Filter>('todos')
  const [editing, setEditing] = useState<PrincipleId | null>(null)

  const sorted = [...list].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  const ev = sorted.find((e) => e.id === params.get('eval')) ?? sorted[0]

  if (!ev) {
    return (
      <div>
        <PageHeader title="Matriz de evaluación ética" intro="Aquí verás el estado de los diez principios de cada evaluación." />
        <EmptyState title="Primero crea una evaluación" text="La matriz muestra la valoración que registras en la etapa de principios de una evaluación.">
          <Link to="/evaluaciones/nueva" className="btn btn-primary">
            Nueva evaluación ética
          </Link>
          <Link to="/casos" className="btn btn-secondary">
            Partir de un caso
          </Link>
        </EmptyState>
      </div>
    )
  }

  const s = summarize(ev)
  const shown = PRINCIPLES.filter((p) => filter === 'todos' || ev.principles[p.id].status === filter)

  const change = (id: PrincipleId, v: PrincipleAssessment) => {
    if (!saveEvaluation({ ...ev, principles: { ...ev.principles, [id]: v } })) toast.error('No se pudo guardar el cambio en este navegador.')
  }

  return (
    <div>
      <PageHeader title="Matriz de evaluación ética" intro="Estado de los diez principios para una evaluación. Sirve para ver dónde hace falta atención, no para calificar el proyecto." />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,320px)_1fr]">
        <div>
          <SelectField label="Evaluación" value={ev.id} onChange={(v) => setParams({ eval: v })} options={sorted.map((e) => ({ value: e.id, label: e.project.name || 'Sin nombre' }))} />
        </div>
        <div className="card p-5">
          <PrincipleStrip evaluation={ev} size="lg" />
          <div className="mt-3">
            <StripLegend />
          </div>
          <p className="mt-3 text-sm font-semibold">
            {s.evaluated} de {s.total} principios valorados · {s.counts.atencion} requieren atención
          </p>
          <p className="mt-1 text-xs text-ink-mute">
            Este indicador solo mide cuánto de la autoevaluación está hecho. No es un puntaje de ética ni garantiza que el sistema sea seguro, justo o responsable: las valoraciones son criterio de quien las registra.
          </p>
        </div>
      </div>

      <div className="mt-8" role="group" aria-label="Filtrar principios por estado">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button key={f.value} type="button" aria-pressed={filter === f.value} onClick={() => setFilter(f.value)} className={`btn btn-sm ${filter === f.value ? 'bg-ink text-white' : 'btn-secondary'}`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {shown.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-line-strong p-6 text-center text-ink-soft">Ningún principio tiene este estado en la evaluación seleccionada.</p>
      ) : (
        <ul className="mt-6 space-y-4">
          {shown.map((p) => {
            const a = ev.principles[p.id]
            return (
              <li key={p.id}>
                {editing === p.id ? (
                  <div>
                    <PrincipleAssessor principle={p} value={a} onChange={(v) => change(p.id, v)} />
                    <button type="button" className="btn btn-secondary btn-sm mt-3" onClick={() => setEditing(null)}>
                      Cerrar edición
                    </button>
                  </div>
                ) : (
                  <section className="card p-5 sm:p-6" aria-labelledby={`m-${p.id}`}>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <h2 id={`m-${p.id}`} className="text-lg font-semibold">
                        {p.name}
                      </h2>
                      <StatusBadge status={a.status} />
                    </div>
                    <p className="mt-1 text-sm text-ink-soft">{p.description}</p>
                    <div className="mt-4 grid gap-4 text-sm md:grid-cols-2">
                      <div>
                        <p className="font-semibold">Observaciones</p>
                        <p className="mt-0.5 whitespace-pre-line text-ink-soft">{a.notes.trim() || 'Sin observaciones.'}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Medidas de mejora registradas</p>
                        <p className="mt-0.5 whitespace-pre-line text-ink-soft">{a.improvement.trim() || 'Sin medidas registradas.'}</p>
                      </div>
                    </div>
                    {a.status !== 'cumplido' && (
                      <div className="mt-4 rounded-lg bg-[#F8F5EE] px-4 py-3 text-sm">
                        <p className="font-semibold">Recomendaciones de mejora</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5 text-ink-soft">
                          {p.recommendations.map((r) => (
                            <li key={r}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <details className="mt-4 text-sm">
                      <summary className="cursor-pointer font-semibold">Preguntas de evaluación</summary>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-ink-soft">
                        {p.questions.map((q) => (
                          <li key={q}>{q}</li>
                        ))}
                      </ul>
                    </details>
                    <button type="button" className="btn btn-secondary btn-sm mt-4" onClick={() => setEditing(p.id)} aria-label={`Editar valoración de ${p.name}`}>
                      Editar valoración
                    </button>
                  </section>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
