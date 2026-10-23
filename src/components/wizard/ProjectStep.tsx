import { SYSTEM_TYPES, type SystemType } from '../../types'
import { SelectField, TextArea, TextField } from '../ui'
import type { StepProps } from './types'

export default function ProjectStep({ ev, update, errors }: StepProps) {
  const p = ev.project
  const set = (patch: Partial<typeof p>) => update({ project: { ...p, ...patch } })
  return (
    <div className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <TextField label="Nombre del proyecto" value={p.name} onChange={(v) => set({ name: v })} required error={errors.name} placeholder="Ej.: Asistente de admisiones" />
        <SelectField label="Tipo de sistema" value={p.type} onChange={(v) => set({ type: v as SystemType })} options={SYSTEM_TYPES} />
      </div>
      <TextArea label="Descripción de la solución" value={p.description} onChange={(v) => set({ description: v })} required error={errors.description} rows={4} hint="¿Qué hace el sistema y cómo toma o apoya decisiones?" />
      <TextArea label="Objetivo principal" value={p.objective} onChange={(v) => set({ objective: v })} required error={errors.objective} rows={2} hint="¿Qué problema busca resolver y para quién?" />
      <TextArea label="Contexto de utilización" value={p.context} onChange={(v) => set({ context: v })} rows={3} hint="¿Dónde, con quién y bajo qué condiciones se usará? Incluye el dilema ético que te preocupa." />
    </div>
  )
}
