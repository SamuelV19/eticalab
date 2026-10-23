import { PRINCIPLE_BY_ID } from '../data/principles'
import type { Alternative } from '../types'

const ROWS: { key: keyof Alternative; label: string }[] = [
  { key: 'description', label: 'Descripción' },
  { key: 'benefits', label: 'Beneficios esperados' },
  { key: 'risks', label: 'Riesgos' },
  { key: 'affected', label: 'Personas afectadas' },
  { key: 'principles', label: 'Principios favorecidos' },
  { key: 'limitations', label: 'Limitaciones' },
  { key: 'mitigation', label: 'Medidas de mitigación' },
]

function Cell({ alt, k }: { alt: Alternative; k: keyof Alternative }) {
  if (k === 'principles') {
    return alt.principles.length ? (
      <ul className="flex flex-wrap gap-1.5">
        {alt.principles.map((p) => (
          <li key={p} className="rounded-full bg-brand-tint px-2 py-0.5 text-xs font-semibold text-brand-deep">
            {PRINCIPLE_BY_ID[p].short}
          </li>
        ))}
      </ul>
    ) : (
      <span className="text-ink-mute">Sin indicar</span>
    )
  }
  const v = String(alt[k] ?? '').trim()
  return v ? <span className="whitespace-pre-line">{v}</span> : <span className="text-ink-mute">Sin indicar</span>
}

export default function ComparisonTable({ alternatives, chosenId }: { alternatives: Alternative[]; chosenId?: string }) {
  const list = alternatives.filter((a) => a.name.trim())
  if (list.length === 0) return <p className="text-sm text-ink-mute">Aún no hay alternativas con nombre para comparar.</p>
  return (
    <>
      <div className="hidden md:block">
        <table className="w-full table-fixed border-separate border-spacing-0 text-sm">
          <caption className="sr-only">Comparación de alternativas</caption>
          <thead>
            <tr>
              <th scope="col" className="w-36 border-b border-line-strong p-3 text-left font-semibold text-ink-mute">
                Aspecto
              </th>
              {list.map((a) => (
                <th key={a.id} scope="col" className="border-b border-line-strong p-3 text-left align-top">
                  <span className="font-display text-base font-bold">{a.name}</span>
                  {chosenId === a.id && <span className="ml-2 rounded-full bg-ink px-2 py-0.5 text-xs font-semibold text-white">Elegida</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.key}>
                <th scope="row" className="border-b border-line p-3 text-left align-top font-semibold text-ink-soft">
                  {r.label}
                </th>
                {list.map((a) => (
                  <td key={a.id} className="border-b border-line p-3 align-top">
                    <Cell alt={a} k={r.key} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="space-y-4 md:hidden">
        {list.map((a) => (
          <article key={a.id} className="rounded-xl border border-line p-4">
            <h4 className="font-display text-base font-bold">
              {a.name}
              {chosenId === a.id && <span className="ml-2 rounded-full bg-ink px-2 py-0.5 text-xs font-semibold text-white">Elegida</span>}
            </h4>
            <dl className="mt-3 space-y-3 text-sm">
              {ROWS.map((r) => (
                <div key={r.key}>
                  <dt className="font-semibold text-ink-soft">{r.label}</dt>
                  <dd className="mt-0.5">
                    <Cell alt={a} k={r.key} />
                  </dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </div>
    </>
  )
}
