import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { SYSTEM_TYPES } from '../types'
import { useEvaluations } from '../hooks/useEvaluations'
import { useToast } from '../components/Toast'
import { ConfirmDialog, EmptyState, EvalStatusBadge, PageHeader, PrincipleStrip } from '../components/ui'
import { formatShort } from '../utils/dates'
import { deleteEvaluation } from '../utils/storage'
import type { Evaluation } from '../types'

const TYPE_LABEL = Object.fromEntries(SYSTEM_TYPES.map((t) => [t.value, t.label]))

export default function EvaluationsPage() {
  const list = useEvaluations()
  const toast = useToast()
  const [q, setQ] = useState('')
  const [type, setType] = useState('todos')
  const [status, setStatus] = useState('todos')
  const [order, setOrder] = useState<'reciente' | 'antigua'>('reciente')
  const [toDelete, setToDelete] = useState<Evaluation | null>(null)

  const shown = useMemo(() => {
    const term = q.trim().toLowerCase()
    return list
      .filter((e) => (term ? e.project.name.toLowerCase().includes(term) : true))
      .filter((e) => (type === 'todos' ? true : e.project.type === type))
      .filter((e) => (status === 'todos' ? true : e.status === status))
      .sort((a, b) => (order === 'reciente' ? b.updatedAt.localeCompare(a.updatedAt) : a.updatedAt.localeCompare(b.updatedAt)))
  }, [list, q, type, status, order])

  const confirmDelete = () => {
    if (!toDelete) return
    if (deleteEvaluation(toDelete.id)) toast.success(`Se eliminó «${toDelete.project.name || 'la evaluación'}».`)
    else toast.error('No se pudo actualizar el almacenamiento del navegador.')
    setToDelete(null)
  }

  return (
    <div>
      <PageHeader
        title="Evaluaciones"
        intro="Historial de tus análisis éticos. Búscalos, filtra por tipo o estado, y abre el informe o continúa editando."
        actions={
          <Link to="/evaluaciones/nueva" className="btn btn-primary">
            <Plus className="h-4 w-4" aria-hidden /> Nueva evaluación ética
          </Link>
        }
      />

      {list.length === 0 ? (
        <EmptyState title="No hay evaluaciones guardadas" text="Crea tu primera evaluación o importa una copia de seguridad desde Ajustes.">
          <Link to="/evaluaciones/nueva" className="btn btn-primary">
            Nueva evaluación ética
          </Link>
          <Link to="/casos" className="btn btn-secondary">
            Partir de un caso
          </Link>
        </EmptyState>
      ) : (
        <>
          <form role="search" onSubmit={(e) => e.preventDefault()} className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
            <div className="relative">
              <label htmlFor="buscar" className="sr-only">
                Buscar por nombre
              </label>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute" aria-hidden />
              <input id="buscar" type="search" className="input pl-9" placeholder="Buscar por nombre" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
            <div>
              <label htmlFor="f-tipo" className="sr-only">
                Filtrar por tipo de sistema
              </label>
              <select id="f-tipo" className="input" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="todos">Todos los tipos</option>
                {SYSTEM_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="f-estado" className="sr-only">
                Filtrar por estado
              </label>
              <select id="f-estado" className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="todos">Todos los estados</option>
                <option value="borrador">Borrador</option>
                <option value="completada">Completada</option>
              </select>
            </div>
            <div>
              <label htmlFor="f-orden" className="sr-only">
                Ordenar por fecha
              </label>
              <select id="f-orden" className="input" value={order} onChange={(e) => setOrder(e.target.value as 'reciente' | 'antigua')}>
                <option value="reciente">Más recientes primero</option>
                <option value="antigua">Más antiguas primero</option>
              </select>
            </div>
          </form>

          <p className="mb-3 text-sm text-ink-soft" role="status" aria-live="polite">
            {shown.length} de {list.length} {list.length === 1 ? 'evaluación' : 'evaluaciones'}
          </p>

          {shown.length === 0 ? (
            <EmptyState title="Ninguna evaluación coincide" text="Prueba con otro nombre o quita algún filtro.">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setQ('')
                  setType('todos')
                  setStatus('todos')
                }}
              >
                Limpiar filtros
              </button>
            </EmptyState>
          ) : (
            <ul className="space-y-3">
              {shown.map((e) => (
                <li key={e.id} className="card p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-semibold">
                          <Link to={`/evaluaciones/${e.id}`} className="hover:underline">
                            {e.project.name || 'Sin nombre'}
                          </Link>
                        </h2>
                        <EvalStatusBadge status={e.status} />
                      </div>
                      <p className="mt-1 text-sm text-ink-mute">
                        {TYPE_LABEL[e.project.type]} · Actualizada el {formatShort(e.updatedAt)}
                      </p>
                      <div className="mt-3 max-w-md">
                        <PrincipleStrip evaluation={e} size="sm" />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Link to={`/evaluaciones/${e.id}`} className="btn btn-secondary btn-sm">
                        Ver informe
                      </Link>
                      <Link to={`/evaluaciones/${e.id}/editar`} className="btn btn-secondary btn-sm" aria-label={`Editar ${e.project.name}`}>
                        <Pencil className="h-3.5 w-3.5" aria-hidden /> Editar
                      </Link>
                      <button type="button" className="btn btn-ghost btn-sm text-risk" onClick={() => setToDelete(e)} aria-label={`Eliminar ${e.project.name}`}>
                        <Trash2 className="h-3.5 w-3.5" aria-hidden /> Eliminar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      <ConfirmDialog open={!!toDelete} title="¿Eliminar esta evaluación?" confirmLabel="Eliminar evaluación" onConfirm={confirmDelete} onCancel={() => setToDelete(null)}>
        <p>
          Se borrará «{toDelete?.project.name || 'Sin nombre'}» de este navegador. Esta acción no se puede deshacer, salvo que tengas una copia de seguridad.
        </p>
      </ConfirmDialog>
    </div>
  )
}
