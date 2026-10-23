import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, Link } from 'react-router-dom'
import { BookOpenCheck, FlaskConical, Grid3x3, History, LayoutDashboard, Menu, Plus, Scale, Settings, X } from 'lucide-react'

const NAV = [
  { to: '/', label: 'Panel', icon: LayoutDashboard, end: true },
  { to: '/evaluaciones', label: 'Evaluaciones', icon: History, end: false },
  { to: '/casos', label: 'Casos prácticos', icon: BookOpenCheck, end: false },
  { to: '/matriz', label: 'Matriz ética', icon: Grid3x3, end: false },
  { to: '/fundamento', label: 'Fundamento ético', icon: Scale, end: false },
  { to: '/ajustes', label: 'Ajustes y datos', icon: Settings, end: false },
]

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2.5 rounded-lg" aria-label="ÉticaLab, ir al panel">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-ink">
        <FlaskConical className="h-5 w-5" aria-hidden />
      </span>
      <span className="leading-tight">
        <span className="block font-display text-lg font-bold">ÉticaLab</span>
        <span className="block text-[11px] text-ink-mute">Laboratorio de Tecnología Responsable</span>
      </span>
    </Link>
  )
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav aria-label="Principal">
      <ul className="space-y-1">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex min-h-[44px] items-center gap-3 rounded-lg px-3 text-sm font-semibold transition-colors ${
                  isActive ? 'bg-ink text-white' : 'text-ink-soft hover:bg-[#F1EDE4]'
                }`
              }
            >
              <Icon className="h-[18px] w-[18px]" aria-hidden />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default function Layout() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    setOpen(false)
    window.scrollTo(0, 0)
  }, [pathname])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div className="app-shell min-h-screen lg:flex">
      <a href="#contenido" className="no-print sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[70] focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-white">
        Saltar al contenido
      </a>

      <aside className="no-print sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-line bg-white/70 p-4 lg:flex">
        <div className="px-1 pb-6 pt-2">
          <Brand />
        </div>
        <Link to="/evaluaciones/nueva" className="btn btn-primary mb-5 w-full">
          <Plus className="h-4 w-4" aria-hidden /> Nueva evaluación ética
        </Link>
        <NavList />
        <p className="mt-auto px-2 text-xs leading-relaxed text-ink-mute">
          Herramienta educativa. Tus datos se guardan solo en este navegador.
        </p>
      </aside>

      <header className="no-print sticky top-0 z-40 flex items-center justify-between border-b border-line bg-paper/95 px-4 py-3 backdrop-blur lg:hidden">
        <Brand />
        <button type="button" onClick={() => setOpen(true)} className="btn btn-secondary px-3" aria-label="Abrir menú" aria-expanded={open} aria-controls="menu-movil">
          <Menu className="h-5 w-5" aria-hidden />
        </button>
      </header>

      {open && (
        <div className="no-print fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menú de navegación">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} />
          <div id="menu-movil" className="absolute right-0 top-0 flex h-full w-[82%] max-w-xs flex-col bg-white p-4 shadow-xl">
            <div className="mb-4 flex justify-end">
              <button type="button" onClick={() => setOpen(false)} className="btn btn-ghost px-3" aria-label="Cerrar menú" autoFocus>
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <Link to="/evaluaciones/nueva" className="btn btn-primary mb-4 w-full">
              <Plus className="h-4 w-4" aria-hidden /> Nueva evaluación ética
            </Link>
            <NavList onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <main id="contenido" className="app-main mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-8 lg:py-12">
        <Outlet />
      </main>
    </div>
  )
}
