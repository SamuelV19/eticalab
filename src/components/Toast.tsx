import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { AlertCircle, CheckCircle2, X } from 'lucide-react'

type Kind = 'ok' | 'error'
interface ToastItem {
  id: number
  kind: Kind
  text: string
}
interface ToastApi {
  success: (text: string) => void
  error: (text: string) => void
}

const Ctx = createContext<ToastApi | null>(null)

export function useToast(): ToastApi {
  const c = useContext(Ctx)
  if (!c) throw new Error('useToast debe usarse dentro de ToastProvider')
  return c
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])

  const dismiss = useCallback((id: number) => setItems((l) => l.filter((t) => t.id !== id)), [])
  const push = useCallback(
    (kind: Kind, text: string) => {
      const id = Date.now() + Math.random()
      setItems((l) => [...l.slice(-2), { id, kind, text }])
      setTimeout(() => dismiss(id), kind === 'error' ? 7000 : 4000)
    },
    [dismiss],
  )
  const api = useMemo<ToastApi>(
    () => ({ success: (t) => push('ok', t), error: (t) => push('error', t) }),
    [push],
  )

  return (
    <Ctx.Provider value={api}>
      {children}
      <div className="no-print pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4">
        {items.map((t) => (
          <div
            key={t.id}
            role={t.kind === 'error' ? 'alert' : 'status'}
            className={`toast-in pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-lg ${
              t.kind === 'error' ? 'border-risk/30 bg-risk-tint text-risk' : 'border-ok/30 bg-ok-tint text-ok'
            }`}
          >
            {t.kind === 'error' ? <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden /> : <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />}
            <p className="flex-1 font-medium">{t.text}</p>
            <button type="button" onClick={() => dismiss(t.id)} aria-label="Cerrar notificación" className="rounded p-0.5 hover:bg-black/5">
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  )
}
