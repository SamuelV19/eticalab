import { Link } from 'react-router-dom'
import { PRINCIPLE_BY_ID } from '../data/principles'
import { TRACEABILITY } from '../data/traceability'
import { PageHeader } from '../components/ui'

export default function FoundationPage() {
  return (
    <div>
      <PageHeader
        title="Fundamento ético"
        intro="Cada función de ÉticaLab existe por una razón ética. Esta matriz conecta las temáticas del V Congreso Internacional de Ética con decisiones concretas de diseño."
      />

      <p className="mb-8 max-w-3xl rounded-lg bg-info-tint px-4 py-3 text-sm text-info">
        Las relaciones son inferencias de diseño hechas a partir de los títulos y descripciones del programa. No son citas ni posturas de los ponentes.
      </p>

      <section aria-labelledby="trazabilidad">
        <h2 id="trazabilidad" className="mb-1 text-2xl font-bold">
          Matriz de trazabilidad
        </h2>
        <p className="mb-5 max-w-3xl text-ink-soft">Temática del congreso, problema ético inferido, principio de diseño, funcionalidad implementada y beneficio esperado.</p>

        <div className="hidden overflow-hidden rounded-2xl border border-line bg-white lg:block">
          <table className="w-full table-fixed border-collapse text-sm">
            <caption className="sr-only">Matriz de trazabilidad académica</caption>
            <thead className="bg-[#F8F5EE] text-left">
              <tr>
                {['Temática del congreso', 'Problema ético inferido', 'Principio de diseño', 'Funcionalidad en ÉticaLab', 'Beneficio esperado'].map((h) => (
                  <th key={h} scope="col" className="p-3 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TRACEABILITY.map((r) => (
                <tr key={r.theme} className="border-t border-line align-top">
                  <th scope="row" className="p-3 text-left font-semibold">
                    {r.theme}
                  </th>
                  <td className="p-3 text-ink-soft">{r.problem}</td>
                  <td className="p-3">
                    <p>{r.designPrinciple}</p>
                    <ul className="mt-2 flex flex-wrap gap-1">
                      {r.principles.map((p) => (
                        <li key={p} className="rounded-full bg-brand-tint px-2 py-0.5 text-xs font-semibold text-brand-deep">
                          {PRINCIPLE_BY_ID[p].short}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="p-3 text-ink-soft">{r.feature}</td>
                  <td className="p-3 text-ink-soft">{r.benefit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ul className="space-y-4 lg:hidden">
          {TRACEABILITY.map((r) => (
            <li key={r.theme} className="card p-5">
              <h3 className="text-base font-bold">{r.theme}</h3>
              <dl className="mt-3 space-y-3 text-sm">
                <div>
                  <dt className="font-semibold">Problema ético inferido</dt>
                  <dd className="text-ink-soft">{r.problem}</dd>
                </div>
                <div>
                  <dt className="font-semibold">Principio de diseño</dt>
                  <dd className="text-ink-soft">{r.designPrinciple}</dd>
                </div>
                <div>
                  <dt className="font-semibold">Funcionalidad en ÉticaLab</dt>
                  <dd className="text-ink-soft">{r.feature}</dd>
                </div>
                <div>
                  <dt className="font-semibold">Beneficio esperado</dt>
                  <dd className="text-ink-soft">{r.benefit}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12 grid gap-6 md:grid-cols-2" aria-label="Objetivo y límites">
        <div className="card p-6">
          <h2 className="text-xl font-bold">Qué demuestra este proyecto</h2>
          <p className="mt-2 text-ink-soft">
            La actividad pide trasladar los dilemas éticos del congreso al ejercicio de la Ingeniería Informática. ÉticaLab lo hace convirtiendo cada tema en una etapa, un campo o una pregunta de trabajo: quién resulta afectado, qué riesgos hay, qué principios se cuidan, qué alternativas existen y quién responde por la decisión.
          </p>
          <p className="mt-3">
            <Link to="/casos" className="link">
              Ver casos prácticos
            </Link>
          </p>
        </div>
        <div className="card p-6">
          <h2 className="text-xl font-bold">Limitaciones</h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-ink-soft">
            <li>Es una herramienta educativa, no una certificación ni asesoría legal.</li>
            <li>Las valoraciones son autoevaluaciones: dependen del criterio y la honestidad de quien las registra.</li>
            <li>No calcula un puntaje de ética ni decide si un proyecto es ético o no.</li>
            <li>Los datos viven solo en este navegador y no se sincronizan entre dispositivos.</li>
            <li>Los diez principios son una selección práctica, no una lista exhaustiva.</li>
          </ul>
        </div>
      </section>
    </div>
  )
}
