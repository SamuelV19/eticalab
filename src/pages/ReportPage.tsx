import { useState, type ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Download, Pencil, Printer, Trash2 } from 'lucide-react'
import { CASE_BY_ID } from '../data/cases'
import { PRINCIPLES } from '../data/principles'
import { GROUP_LABEL, RISK_LABEL, STATUS_SHORT } from '../data/taxonomy'
import { SYSTEM_TYPES } from '../types'
import { useEvaluation } from '../hooks/useEvaluations'
import { useToast } from '../components/Toast'
import ComparisonTable from '../components/ComparisonTable'
import FindingsList from '../components/FindingsList'
import { ConfirmDialog, EmptyState, EvalStatusBadge, PrincipleStrip, SeverityBadge, StatusBadge, StripLegend } from '../components/ui'
import { summarize } from '../utils/analysis'
import { formatDate } from '../utils/dates'
import { downloadText, slug } from '../utils/download'
import { deleteEvaluation } from '../utils/storage'
import { buildBackup } from '../utils/validation'

const TYPE_LABEL = Object.fromEntries(SYSTEM_TYPES.map((t) => [t.value, t.label]))

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="report-section mt-10" aria-label={title}>
      <h2 className="border-b border-line-strong pb-2 text-xl font-bold">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  )
}

function Field({ label, text }: { label: string; text?: string }) {
  const v = (text ?? '').trim()
  return (
    <div className="report-block">
      <dt className="text-sm font-semibold text-ink-soft">{label}</dt>
      <dd className="mt-0.5 whitespace-pre-line">{v || <span className="text-ink-mute">No indicado</span>}</dd>
    </div>
  )
}

export default function ReportPage() {
  const { id } = useParams()
  const ev = useEvaluation(id)
  const navigate = useNavigate()
  const toast = useToast()
  const [confirm, setConfirm] = useState(false)

  if (!ev) {
    return (
      <EmptyState title="No encontramos esta evaluación" text="Puede que se haya eliminado o que se haya creado en otro navegador.">
        <Link to="/evaluaciones" className="btn btn-primary">
          Ver evaluaciones
        </Link>
      </EmptyState>
    )
  }

  const s = summarize(ev)
  const chosen = ev.alternatives.find((a) => a.id === ev.decision.chosenAlternativeId)
  const risks = ev.risks.filter((r) => r.description.trim())
  const groups = ev.groups.filter((g) => g.name.trim())
  const src = ev.sourceCaseId ? CASE_BY_ID[ev.sourceCaseId] : undefined
  const pending = PRINCIPLES.filter((p) => ev.principles[p.id].status === 'no_evaluado')

  const remove = () => {
    if (deleteEvaluation(ev.id)) {
      toast.success(`Se eliminó «${ev.project.name}».`)
      navigate('/evaluaciones')
    } else toast.error('No se pudo actualizar el almacenamiento del navegador.')
  }

  return (
    <article>
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link to="/evaluaciones" className="link text-sm">
          Volver a evaluaciones
        </Link>
        <div className="flex flex-wrap gap-2">
          <Link to={`/evaluaciones/${ev.id}/editar`} className="btn btn-secondary btn-sm">
            <Pencil className="h-3.5 w-3.5" aria-hidden /> Editar
          </Link>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => downloadText(`eticalab-${slug(ev.project.name)}.json`, JSON.stringify(buildBackup([ev]), null, 2))}>
            <Download className="h-3.5 w-3.5" aria-hidden /> Exportar JSON
          </button>
          <button type="button" className="btn btn-primary btn-sm" onClick={() => window.print()}>
            <Printer className="h-3.5 w-3.5" aria-hidden /> Imprimir o guardar PDF
          </button>
          <button type="button" className="btn btn-ghost btn-sm text-risk" onClick={() => setConfirm(true)}>
            <Trash2 className="h-3.5 w-3.5" aria-hidden /> Eliminar
          </button>
        </div>
      </div>

      <header>
        <p className="text-sm font-semibold text-brand-deep">Informe de evaluación ética · ÉticaLab</p>
        <h1 className="mt-1 text-3xl font-bold sm:text-4xl">{ev.project.name || 'Sin nombre'}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-soft">
          <EvalStatusBadge status={ev.status} />
          <span>Fecha de elaboración: {formatDate(ev.createdAt)}</span>
          <span>Última actualización: {formatDate(ev.updatedAt)}</span>
        </div>
        <p className="mt-4 rounded-lg bg-[#F8F5EE] px-4 py-3 text-sm text-ink-soft">
          Este informe documenta una autoevaluación hecha por el equipo. No certifica que el sistema sea ético, seguro o justo: ayuda a identificar riesgos y a justificar decisiones, que siguen siendo responsabilidad de las personas.
        </p>
      </header>

      <Section title="1. Información del proyecto">
        <dl className="grid gap-4 sm:grid-cols-2">
          <Field label="Tipo de sistema" text={TYPE_LABEL[ev.project.type]} />
          <Field label="Objetivo principal" text={ev.project.objective} />
          <div className="sm:col-span-2">
            <Field label="Descripción de la solución" text={ev.project.description} />
          </div>
        </dl>
      </Section>

      <Section title="2. Descripción del dilema">
        <dl className="space-y-4">
          <Field label="Contexto de utilización y dilema" text={ev.project.context} />
        </dl>
        {src && <p className="mt-3 text-sm text-ink-mute">Esta evaluación partió del caso educativo «{src.title}», creado para ÉticaLab.</p>}
      </Section>

      <Section title="3. Personas afectadas">
        {groups.length === 0 ? (
          <p className="text-ink-mute">No se identificaron personas o grupos afectados.</p>
        ) : (
          <ul className="space-y-3">
            {groups.map((g) => (
              <li key={g.id} className="report-block rounded-xl border border-line p-4">
                <p className="font-semibold">{g.name}</p>
                <p className="text-sm text-ink-mute">{GROUP_LABEL[g.category]}</p>
                {g.description.trim() && <p className="mt-1 whitespace-pre-line">{g.description}</p>}
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="4. Riesgos identificados">
        {risks.length === 0 ? (
          <p className="text-ink-mute">No se registraron riesgos.</p>
        ) : (
          <ul className="space-y-3">
            {risks.map((r) => (
              <li key={r.id} className="report-block rounded-xl border border-line p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold">{RISK_LABEL[r.category]}</p>
                  <SeverityBadge severity={r.severity} />
                </div>
                <p className="mt-1 whitespace-pre-line">{r.description}</p>
                <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-3">
                  <Field label="A quién afecta" text={r.affected} />
                  <Field label="Consecuencias" text={r.consequences} />
                  <Field label="Medidas preventivas" text={r.preventive} />
                </dl>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="5. Evaluación de principios">
        <PrincipleStrip evaluation={ev} />
        <div className="mt-2">
          <StripLegend />
        </div>
        <p className="mt-3 text-sm text-ink-soft">
          {s.counts.cumplido} cumplidos según la autoevaluación · {s.counts.atencion} requieren atención · {s.counts.no_evaluado} sin evaluar. Estos conteos describen el avance de la autoevaluación; no son una calificación del proyecto.
        </p>
        <ul className="mt-5 space-y-3">
          {PRINCIPLES.map((p) => {
            const a = ev.principles[p.id]
            return (
              <li key={p.id} className="report-block rounded-xl border border-line p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold">{p.name}</p>
                  <StatusBadge status={a.status} />
                </div>
                {a.status === 'no_evaluado' && !a.notes.trim() && !a.improvement.trim() ? (
                  <p className="mt-1 text-sm text-ink-mute">Este principio aún no se ha evaluado.</p>
                ) : (
                  <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                    <Field label="Observaciones" text={a.notes} />
                    <Field label="Medidas de mejora" text={a.improvement} />
                  </dl>
                )}
              </li>
            )
          })}
        </ul>
      </Section>

      <Section title="6. Alternativas comparadas">
        <ComparisonTable alternatives={ev.alternatives} chosenId={ev.decision.chosenAlternativeId} />
      </Section>

      <Section title="7. Decisión adoptada">
        <dl className="space-y-4">
          <Field label="Alternativa elegida" text={chosen?.name} />
          <Field label="Justificación" text={ev.decision.justification} />
          <Field label="Riesgos aceptados o pendientes" text={ev.decision.acceptedRisks} />
          <Field label="Medidas y acciones preventivas" text={ev.decision.actions} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Responsable de revisar las medidas" text={ev.decision.reviewer} />
            <Field label="Próxima revisión" text={ev.decision.nextReview ? formatDate(`${ev.decision.nextReview}T12:00:00`) : ''} />
          </div>
        </dl>
      </Section>

      <Section title="8. Aspectos pendientes">
        <FindingsList findings={s.findings} />
        {pending.length > 0 && (
          <div className="report-block mt-4">
            <p className="font-semibold">Principios sin evaluar ({pending.length})</p>
            <p className="mt-1 text-sm text-ink-soft">{pending.map((p) => p.name).join('; ')}.</p>
          </div>
        )}
        <p className="mt-6 text-xs text-ink-mute">
          Estados posibles de cada principio: {Object.values(STATUS_SHORT).join(' · ')}. Informe generado con ÉticaLab, herramienta educativa. Los datos se almacenan solo en el navegador de quien los creó.
        </p>
      </Section>

      <ConfirmDialog open={confirm} title="¿Eliminar esta evaluación?" confirmLabel="Eliminar evaluación" onConfirm={remove} onCancel={() => setConfirm(false)}>
        <p>Se borrará «{ev.project.name}» de este navegador. Esta acción no se puede deshacer, salvo que tengas una copia de seguridad.</p>
      </ConfirmDialog>
    </article>
  )
}
