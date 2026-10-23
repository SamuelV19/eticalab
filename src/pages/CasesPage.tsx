import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { CASES } from '../data/cases'
import { PRINCIPLE_BY_ID } from '../data/principles'
import { SYSTEM_TYPES } from '../types'
import { PageHeader } from '../components/ui'

const TYPE_LABEL = Object.fromEntries(SYSTEM_TYPES.map((t) => [t.value, t.label]))

export default function CasesPage() {
  return (
    <div>
      <PageHeader
        title="Casos prácticos"
        intro="Seis situaciones inventadas para aprender a usar ÉticaLab. Abre uno, léelo y conviértelo en una evaluación editable."
      />
      <p className="mb-6 rounded-lg bg-info-tint px-4 py-3 text-sm text-info">
        Son casos educativos creados para esta plataforma. No describen hechos reales ni se atribuyen a los ponentes del congreso.
      </p>
      <ul className="grid gap-4 md:grid-cols-2">
        {CASES.map((c) => (
          <li key={c.id} className="card flex flex-col p-5">
            <p className="text-sm font-semibold text-brand-deep">{c.tagline}</p>
            <h2 className="mt-1 text-xl font-bold leading-snug">{c.title}</h2>
            <p className="mt-2 text-sm text-ink-soft">{c.context}</p>
            <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Principios implicados">
              {c.principles.map((p) => (
                <li key={p} className="rounded-full bg-[#F1EDE4] px-2.5 py-0.5 text-xs font-semibold text-ink-soft">
                  {PRINCIPLE_BY_ID[p].short}
                </li>
              ))}
            </ul>
            <div className="mt-auto flex items-center justify-between gap-3 pt-5">
              <span className="text-xs text-ink-mute">{TYPE_LABEL[c.systemType]}</span>
              <Link to={`/casos/${c.id}`} className="link inline-flex items-center gap-1 text-sm">
                Abrir caso <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
