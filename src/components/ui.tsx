import { useEffect, useId, useRef, type ReactNode } from 'react'
import { AlertTriangle, CircleDashed, CircleCheck, CircleAlert } from 'lucide-react'
import { PRINCIPLES } from '../data/principles'
import { STATUS_SHORT } from '../data/taxonomy'
import type { Evaluation, PrincipleStatus, Severity } from '../types'

export function PageHeader({ title, intro, actions }: { title: string; intro?: ReactNode; actions?: ReactNode }) {
  return (
    <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold sm:text-[2.1rem] sm:leading-tight">{title}</h1>
        {intro && <p className="mt-2 text-ink-soft">{intro}</p>}
      </div>
      {actions && <div className="no-print flex flex-wrap gap-2">{actions}</div>}
    </header>
  )
}

export function EmptyState({ title, text, children }: { title: string; text: string; children?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-line-strong bg-white/60 px-6 py-12 text-center">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-ink-soft">{text}</p>
      {children && <div className="mt-6 flex flex-wrap justify-center gap-3">{children}</div>}
    </div>
  )
}

const STATUS_STYLE: Record<PrincipleStatus, string> = {
  cumplido: 'bg-ok-tint text-ok',
  atencion: 'bg-warn-tint text-warn',
  no_evaluado: 'bg-[#EFEDE8] text-ink-soft',
}

export function StatusIcon({ status, className = 'h-4 w-4' }: { status: PrincipleStatus; className?: string }) {
  if (status === 'cumplido') return <CircleCheck className={className} aria-hidden />
  if (status === 'atencion') return <CircleAlert className={className} aria-hidden />
  return <CircleDashed className={className} aria-hidden />
}

export function StatusBadge({ status }: { status: PrincipleStatus }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLE[status]}`}>
      <StatusIcon status={status} className="h-3.5 w-3.5" />
      {STATUS_SHORT[status]}
    </span>
  )
}

export function EvalStatusBadge({ status }: { status: Evaluation['status'] }) {
  return status === 'completada' ? (
    <span className="rounded-full bg-ink px-2.5 py-1 text-xs font-semibold text-white">Completada</span>
  ) : (
    <span className="rounded-full bg-brand-tint px-2.5 py-1 text-xs font-semibold text-brand-deep">Borrador</span>
  )
}

const SEV: Record<Severity, string> = {
  baja: 'bg-info-tint text-info',
  media: 'bg-warn-tint text-warn',
  alta: 'bg-risk-tint text-risk',
}
export function SeverityBadge({ severity }: { severity: Severity }) {
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${SEV[severity]}`}>Severidad {severity}</span>
}

const SEG: Record<PrincipleStatus, string> = {
  cumplido: 'bg-ok',
  atencion: 'bg-warn-bar',
  no_evaluado: 'bg-[#DDD8CC]',
}

/** Diez segmentos, uno por principio. Es la firma visual del producto. */
export function PrincipleStrip({ evaluation, size = 'md' }: { evaluation: Evaluation; size?: 'sm' | 'md' | 'lg' }) {
  const h = size === 'lg' ? 'h-10' : size === 'md' ? 'h-6' : 'h-3'
  const summary = PRINCIPLES.map((p) => `${p.short}: ${STATUS_SHORT[evaluation.principles[p.id].status]}`).join('; ')
  return (
    <div role="img" aria-label={`Estado de los diez principios. ${summary}`} className="flex gap-1">
      {PRINCIPLES.map((p) => (
        <span key={p.id} title={`${p.short}: ${STATUS_SHORT[evaluation.principles[p.id].status]}`} className={`${h} flex-1 rounded-[5px] ${SEG[evaluation.principles[p.id].status]}`} />
      ))}
    </div>
  )
}

export function StripLegend() {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-soft">
      {(['cumplido', 'atencion', 'no_evaluado'] as PrincipleStatus[]).map((s) => (
        <li key={s} className="flex items-center gap-1.5">
          <span className={`h-2.5 w-2.5 rounded-sm ${SEG[s]}`} aria-hidden />
          {STATUS_SHORT[s]}
        </li>
      ))}
    </ul>
  )
}

interface FieldProps {
  label: string
  hint?: string
  error?: string
  required?: boolean
  children: (p: { id: string; describedBy?: string; invalid: boolean }) => ReactNode
}

export function Field({ label, hint, error, required, children }: FieldProps) {
  const id = useId()
  const hintId = hint ? `${id}-hint` : undefined
  const errId = error ? `${id}-err` : undefined
  const describedBy = [hintId, errId].filter(Boolean).join(' ') || undefined
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">
        {label}
        {required && <span className="text-brand-deep" aria-hidden> *</span>}
        {required && <span className="sr-only"> (obligatorio)</span>}
      </label>
      {hint && (
        <p id={hintId} className="mb-1.5 text-[13px] text-ink-mute">
          {hint}
        </p>
      )}
      {children({ id, describedBy, invalid: !!error })}
      {error && (
        <p id={errId} role="alert" className="mt-1.5 flex items-center gap-1.5 text-[13px] font-medium text-risk">
          <AlertTriangle className="h-3.5 w-3.5" aria-hidden /> {error}
        </p>
      )}
    </div>
  )
}

interface TextFieldProps {
  label: string
  value: string
  onChange: (v: string) => void
  hint?: string
  error?: string
  required?: boolean
  placeholder?: string
  maxLength?: number
  type?: 'text' | 'date'
}
export function TextField({ label, value, onChange, hint, error, required, placeholder, maxLength = 300, type = 'text' }: TextFieldProps) {
  return (
    <Field label={label} hint={hint} error={error} required={required}>
      {({ id, describedBy, invalid }) => (
        <input id={id} type={type} className="input" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} maxLength={maxLength} aria-describedby={describedBy} aria-invalid={invalid} />
      )}
    </Field>
  )
}

interface AreaProps extends Omit<TextFieldProps, 'type'> {
  rows?: number
}
export function TextArea({ label, value, onChange, hint, error, required, placeholder, rows = 3, maxLength = 3000 }: AreaProps) {
  return (
    <Field label={label} hint={hint} error={error} required={required}>
      {({ id, describedBy, invalid }) => (
        <textarea id={id} className="input resize-y leading-relaxed" rows={rows} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} maxLength={maxLength} aria-describedby={describedBy} aria-invalid={invalid} />
      )}
    </Field>
  )
}

interface SelectProps {
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  hint?: string
  error?: string
  required?: boolean
}
export function SelectField({ label, value, onChange, options, hint, error, required }: SelectProps) {
  return (
    <Field label={label} hint={hint} error={error} required={required}>
      {({ id, describedBy, invalid }) => (
        <select id={id} className="input" value={value} onChange={(e) => onChange(e.target.value)} aria-describedby={describedBy} aria-invalid={invalid}>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )}
    </Field>
  )
}

interface ModalProps {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
  footer: ReactNode
}
export function Modal({ open, title, onClose, children, footer }: ModalProps) {
  const ref = useRef<HTMLDivElement>(null)
  const titleId = useId()
  useEffect(() => {
    if (!open) return
    const prev = document.activeElement as HTMLElement | null
    ref.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab' && ref.current) {
        const f = ref.current.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
        if (f.length === 0) return
        const first = f[0]
        const last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      prev?.focus?.()
    }
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="no-print fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 sm:items-center" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={ref} role="dialog" aria-modal="true" aria-labelledby={titleId} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 id={titleId} className="text-xl font-semibold">
          {title}
        </h2>
        <div className="mt-3 text-ink-soft">{children}</div>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">{footer}</div>
      </div>
    </div>
  )
}

interface ConfirmProps {
  open: boolean
  title: string
  children: ReactNode
  confirmLabel: string
  onConfirm: () => void
  onCancel: () => void
}
export function ConfirmDialog({ open, title, children, confirmLabel, onConfirm, onCancel }: ConfirmProps) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onCancel}
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={onCancel} data-autofocus>
            Cancelar
          </button>
          <button type="button" className="btn btn-danger" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </>
      }
    >
      {children}
    </Modal>
  )
}
