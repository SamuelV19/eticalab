import { useCallback, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, Save } from 'lucide-react'
import { CASE_BY_ID, evaluationFromCase } from '../data/cases'
import { useEvaluations } from '../hooks/useEvaluations'
import { useToast } from '../components/Toast'
import { EmptyState, PageHeader } from '../components/ui'
import ProjectStep from '../components/wizard/ProjectStep'
import GroupsStep from '../components/wizard/GroupsStep'
import RisksStep from '../components/wizard/RisksStep'
import PrinciplesStep from '../components/wizard/PrinciplesStep'
import AlternativesStep from '../components/wizard/AlternativesStep'
import DecisionStep from '../components/wizard/DecisionStep'
import type { Evaluation } from '../types'
import { newEvaluation } from '../utils/factory'
import { saveEvaluation } from '../utils/storage'
import { validateDecision, validateProject, type StepErrors } from '../utils/validation'

const STEPS = [
  { title: 'Información del proyecto', short: 'Proyecto', intro: 'Describe qué construyes y en qué contexto se usará.' },
  { title: 'Personas afectadas', short: 'Personas', intro: 'Identifica a quienes el sistema toca, directa o indirectamente.' },
  { title: 'Identificación de riesgos', short: 'Riesgos', intro: 'Registra lo que podría salir mal, para quién y cómo lo prevendrás.' },
  { title: 'Evaluación de principios', short: 'Principios', intro: 'Valora el proyecto frente a diez principios. Es una autoevaluación que requiere tu criterio.' },
  { title: 'Alternativas de solución', short: 'Alternativas', intro: 'Compara cómo podría resolverse el problema antes de decidir.' },
  { title: 'Decisión final', short: 'Decisión', intro: 'Documenta qué decides, por qué y quién revisará las medidas.' },
]

export default function EvaluatorPage() {
  const { id } = useParams()
  const [params] = useSearchParams()
  const list = useEvaluations()
  const caseId = params.get('caso') ?? undefined

  if (id) {
    const found = list.find((e) => e.id === id)
    if (!found) {
      return (
        <EmptyState title="No encontramos esta evaluación" text="Puede que se haya eliminado o que pertenezca a otro navegador.">
          <Link to="/evaluaciones" className="btn btn-primary">
            Ver evaluaciones
          </Link>
        </EmptyState>
      )
    }
    return <Wizard key={id} initial={found} persisted />
  }
  return <Wizard key={`nueva-${caseId ?? 'vacia'}`} initial={caseId && CASE_BY_ID[caseId] ? evaluationFromCase(CASE_BY_ID[caseId]) : newEvaluation()} persisted={false} />
}

function Wizard({ initial, persisted }: { initial: Evaluation; persisted: boolean }) {
  const navigate = useNavigate()
  const toast = useToast()
  const [ev, setEv] = useState<Evaluation>(initial)
  // Los borradores retoman donde quedaron; las evaluaciones completadas se reabren desde la primera etapa.
  const [step, setStep] = useState(initial.status === 'completada' ? 0 : Math.min(initial.currentStep, STEPS.length - 1))
  const [errors, setErrors] = useState<StepErrors>({})

  const update = useCallback((patch: Partial<Evaluation>) => setEv((prev) => ({ ...prev, ...patch })), [])

  const persist = (next: Evaluation, nextStep: number, opts: { silent?: boolean; redirect?: boolean } = {}): boolean => {
    const { silent = true, redirect = true } = opts
    const ok = saveEvaluation({ ...next, currentStep: nextStep })
    if (!ok) {
      toast.error('No se pudo guardar en este navegador. Exporta una copia de seguridad desde Ajustes.')
      return false
    }
    if (!silent) toast.success('Borrador guardado.')
    // Primera vez que se guarda: se pasa a la ruta de edición para que recargar la página no pierda el avance.
    if (!persisted && redirect) navigate(`/evaluaciones/${next.id}/editar`, { replace: true })
    return true
  }

  const goTo = (target: number) => {
    if (target > 0) {
      const e = validateProject(ev)
      if (Object.keys(e).length) {
        setErrors(e)
        setStep(0)
        toast.error('Completa los campos obligatorios del proyecto para continuar.')
        return
      }
    }
    setErrors({})
    persist(ev, target)
    setStep(target)
    window.scrollTo({ top: 0 })
  }

  const saveDraft = () => {
    const e = validateProject(ev)
    if (Object.keys(e).length) {
      setErrors(e)
      setStep(0)
      toast.error('Escribe al menos el nombre, la descripción y el objetivo para guardar el borrador.')
      return
    }
    setErrors({})
    persist(ev, step, { silent: false })
  }

  const finish = () => {
    const e = validateDecision(ev)
    if (Object.keys(e).length) {
      setErrors(e)
      toast.error('Falta completar la decisión final.')
      return
    }
    const done: Evaluation = { ...ev, status: 'completada' }
    if (persist(done, step, { redirect: false })) {
      toast.success('Evaluación guardada. Revisa el informe.')
      navigate(`/evaluaciones/${done.id}`)
    }
  }

  const props = { ev, update, errors }
  const isLast = step === STEPS.length - 1

  return (
    <div>
      <PageHeader
        title={persisted ? 'Editar evaluación' : 'Nueva evaluación ética'}
        intro={ev.sourceCaseId && CASE_BY_ID[ev.sourceCaseId] ? <>Parte del caso educativo «{CASE_BY_ID[ev.sourceCaseId].title}». Edita todo lo que quieras: las valoraciones de principios empiezan sin evaluar.</> : 'Avanza por etapas. Puedes guardar un borrador y volver después.'}
        actions={
          <button type="button" className="btn btn-secondary" onClick={saveDraft}>
            <Save className="h-4 w-4" aria-hidden /> Guardar borrador
          </button>
        }
      />

      <nav aria-label="Etapas de la evaluación" className="mb-8">
        <p className="mb-2 text-sm font-semibold text-ink-soft md:hidden">
          Etapa {step + 1} de {STEPS.length}: {STEPS[step].short}
        </p>
        <ol className="flex gap-1.5">
          {STEPS.map((s, i) => (
            <li key={s.short} className="flex-1">
              <button
                type="button"
                onClick={() => goTo(i)}
                aria-current={i === step ? 'step' : undefined}
                aria-label={`Etapa ${i + 1}: ${s.short}`}
                className={`flex w-full flex-col gap-1.5 rounded-lg text-left ${i === step ? '' : 'opacity-80 hover:opacity-100'}`}
              >
                <span className={`h-1.5 w-full rounded-full ${i < step ? 'bg-ink' : i === step ? 'bg-brand' : 'bg-line-strong'}`} />
                <span className={`hidden text-[13px] md:block ${i === step ? 'font-bold text-ink' : 'font-medium text-ink-soft'}`}>
                  {i + 1}. {s.short}
                </span>
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <section aria-labelledby="titulo-etapa">
        <h2 id="titulo-etapa" className="text-2xl font-bold">
          {STEPS[step].title}
        </h2>
        <p className="mb-6 mt-1 max-w-2xl text-ink-soft">{STEPS[step].intro}</p>
        {step === 0 && <ProjectStep {...props} />}
        {step === 1 && <GroupsStep {...props} />}
        {step === 2 && <RisksStep {...props} />}
        {step === 3 && <PrinciplesStep {...props} />}
        {step === 4 && <AlternativesStep {...props} />}
        {step === 5 && <DecisionStep {...props} />}
      </section>

      <div className="mt-10 flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:justify-between">
        <button type="button" className="btn btn-secondary" onClick={() => goTo(step - 1)} disabled={step === 0}>
          <ArrowLeft className="h-4 w-4" aria-hidden /> Anterior
        </button>
        {isLast ? (
          <button type="button" className="btn btn-primary" onClick={finish}>
            <Check className="h-4 w-4" aria-hidden /> Finalizar y ver informe
          </button>
        ) : (
          <button type="button" className="btn btn-primary" onClick={() => goTo(step + 1)}>
            Siguiente <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
        )}
      </div>
    </div>
  )
}
