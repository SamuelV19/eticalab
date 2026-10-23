import { Plus, Trash2 } from 'lucide-react'
import { GROUP_CATEGORIES } from '../../data/taxonomy'
import type { GroupCategory } from '../../types'
import { newGroup } from '../../utils/factory'
import { SelectField, TextArea, TextField } from '../ui'
import type { StepProps } from './types'

export default function GroupsStep({ ev, update }: StepProps) {
  const add = (category: GroupCategory) => update({ groups: [...ev.groups, newGroup({ category })] })
  const patch = (id: string, p: Partial<(typeof ev.groups)[number]>) => update({ groups: ev.groups.map((g) => (g.id === id ? { ...g, ...p } : g)) })
  const remove = (id: string) => update({ groups: ev.groups.filter((g) => g.id !== id) })

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold">Añadir personas o grupos</p>
        <p className="mt-1 text-sm text-ink-soft">Piensa en quién usa el sistema, de quién se procesan datos y quién recibe consecuencias sin haberlo elegido.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {GROUP_CATEGORIES.map((c) => (
            <button key={c.value} type="button" className="btn btn-secondary btn-sm" onClick={() => add(c.value)} title={c.hint}>
              <Plus className="h-3.5 w-3.5" aria-hidden /> {c.label}
            </button>
          ))}
        </div>
      </div>

      {ev.groups.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line-strong bg-white/60 p-6 text-center text-sm text-ink-soft">
          Aún no agregaste personas afectadas. Usa los botones de arriba para empezar.
        </p>
      ) : (
        <ul className="space-y-4">
          {ev.groups.map((g, i) => (
            <li key={g.id} className="card p-5">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-semibold">Grupo {i + 1}</h3>
                <button type="button" className="btn btn-ghost btn-sm text-risk" onClick={() => remove(g.id)} aria-label={`Eliminar grupo ${i + 1}${g.name ? `: ${g.name}` : ''}`}>
                  <Trash2 className="h-4 w-4" aria-hidden /> Eliminar
                </button>
              </div>
              <div className="mt-3 grid gap-4 md:grid-cols-2">
                <SelectField label="Categoría" value={g.category} onChange={(v) => patch(g.id, { category: v as GroupCategory })} options={GROUP_CATEGORIES} />
                <TextField label="Nombre del grupo" value={g.name} onChange={(v) => patch(g.id, { name: v })} placeholder="Ej.: Aspirantes de zonas rurales" />
              </div>
              <div className="mt-4">
                <TextArea label="¿Cómo los afecta el sistema?" value={g.description} onChange={(v) => patch(g.id, { description: v })} rows={2} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
