import { AlertTriangle, Info } from 'lucide-react'
import type { Finding } from '../utils/analysis'

export default function FindingsList({ findings }: { findings: Finding[] }) {
  if (findings.length === 0) {
    return <p className="rounded-lg bg-ok-tint px-4 py-3 text-sm text-ok">No se detectaron vacíos evidentes en la documentación. Esto no garantiza que no existan otros asuntos por revisar.</p>
  }
  return (
    <ul className="space-y-2">
      {findings.map((f, i) => (
        <li key={i} className={`flex items-start gap-2.5 rounded-lg px-4 py-3 text-sm ${f.level === 'alerta' ? 'bg-risk-tint text-risk' : 'bg-warn-tint text-warn'}`}>
          {f.level === 'alerta' ? <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden /> : <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />}
          <span>
            <span className="sr-only">{f.level === 'alerta' ? 'Alerta: ' : 'Aviso: '}</span>
            {f.text}
          </span>
        </li>
      ))}
    </ul>
  )
}
