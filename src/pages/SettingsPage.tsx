import { useRef, useState } from 'react'
import { Download, RotateCcw, Upload } from 'lucide-react'
import { useEvaluations } from '../hooks/useEvaluations'
import { useToast } from '../components/Toast'
import { ConfirmDialog, PageHeader } from '../components/ui'
import { downloadText } from '../utils/download'
import { mergeEvaluations, replaceAll, resetAll, getStorageInfo, STORAGE_KEY } from '../utils/storage'
import { buildBackup, parseBackup, type ImportResult } from '../utils/validation'

const MAX_BYTES = 5 * 1024 * 1024

function fmtBytes(n: number): string {
  if (n < 1024) return `${n} B`
  return `${(n / 1024).toFixed(1)} KB`
}

export default function SettingsPage() {
  const list = useEvaluations()
  const toast = useToast()
  const fileRef = useRef<HTMLInputElement>(null)
  const [pending, setPending] = useState<ImportResult | null>(null)
  const [importError, setImportError] = useState('')
  const [confirmReset, setConfirmReset] = useState(false)
  const info = getStorageInfo()

  const exportAll = () => {
    if (list.length === 0) {
      toast.error('No hay evaluaciones para exportar.')
      return
    }
    const stamp = new Date().toISOString().slice(0, 10)
    downloadText(`eticalab-copia-${stamp}.json`, JSON.stringify(buildBackup(list), null, 2))
    toast.success(`Se exportaron ${list.length} evaluaciones.`)
  }

  const onFile = (file: File | undefined) => {
    setPending(null)
    setImportError('')
    if (!file) return
    if (file.size > MAX_BYTES) {
      setImportError('El archivo supera los 5 MB. Elige una copia de seguridad de ÉticaLab.')
      return
    }
    const reader = new FileReader()
    reader.onerror = () => setImportError('No se pudo leer el archivo.')
    reader.onload = () => {
      const result = parseBackup(String(reader.result ?? ''))
      if (!result.ok) setImportError(result.error ?? 'El archivo no es válido.')
      else setPending(result)
    }
    reader.readAsText(file)
    if (fileRef.current) fileRef.current.value = ''
  }

  const applyImport = (mode: 'merge' | 'replace') => {
    if (!pending) return
    const ok = mode === 'merge' ? mergeEvaluations(pending.evaluations) : replaceAll(pending.evaluations)
    if (ok) toast.success(`Se importaron ${pending.evaluations.length} evaluaciones.`)
    else toast.error('No se pudo guardar la importación en este navegador.')
    setPending(null)
  }

  const reset = () => {
    resetAll()
    setConfirmReset(false)
    toast.success('Se borraron todas las evaluaciones de este navegador.')
  }

  return (
    <div className="max-w-3xl">
      <PageHeader title="Ajustes y datos" intro="Todo lo que escribes se guarda solo en este navegador. Aquí puedes revisar, copiar, restaurar o borrar esos datos." />

      <div className="space-y-6">
        <section className="card p-6" aria-labelledby="almacenamiento">
          <h2 id="almacenamiento" className="text-xl font-bold">
            Almacenamiento
          </h2>
          <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-ink-mute">Evaluaciones guardadas</dt>
              <dd className="text-lg font-semibold">{list.length}</dd>
            </div>
            <div>
              <dt className="text-ink-mute">Espacio usado</dt>
              <dd className="text-lg font-semibold">{fmtBytes(info.bytes)}</dd>
            </div>
            <div>
              <dt className="text-ink-mute">Estado</dt>
              <dd className="text-lg font-semibold">{info.available ? 'Disponible' : 'No disponible'}</dd>
            </div>
          </dl>
          <p className="mt-3 text-sm text-ink-soft">
            Se usa <code className="rounded bg-[#F1EDE4] px-1">localStorage</code> bajo la clave <code className="rounded bg-[#F1EDE4] px-1">{STORAGE_KEY}</code>. No se sincroniza entre dispositivos ni navegadores, y borrar los datos del sitio o usar una ventana privada los elimina.
          </p>
          {!info.available && <p className="mt-3 rounded-lg bg-risk-tint px-4 py-3 text-sm text-risk">Este navegador bloquea el almacenamiento local. Podrás trabajar, pero los cambios se perderán al cerrar la pestaña.</p>}
        </section>

        <section className="card p-6" aria-labelledby="copias">
          <h2 id="copias" className="text-xl font-bold">
            Copia de seguridad
          </h2>
          <p className="mt-1 text-sm text-ink-soft">Exporta tus evaluaciones a un archivo JSON o restaura una copia anterior. Se valida el archivo antes de importar.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" className="btn btn-secondary" onClick={exportAll}>
              <Download className="h-4 w-4" aria-hidden /> Exportar a JSON
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => fileRef.current?.click()}>
              <Upload className="h-4 w-4" aria-hidden /> Importar copia
            </button>
            <input ref={fileRef} type="file" accept="application/json,.json" className="sr-only" tabIndex={-1} aria-label="Seleccionar archivo de copia de seguridad" data-testid="import-input" onChange={(e) => onFile(e.target.files?.[0])} />
          </div>

          {importError && (
            <p role="alert" className="mt-4 rounded-lg bg-risk-tint px-4 py-3 text-sm font-medium text-risk">
              {importError}
            </p>
          )}

          {pending && (
            <div className="mt-4 rounded-xl border border-line-strong bg-[#F8F5EE] p-4" role="status">
              <p className="font-semibold">
                El archivo es válido: {pending.evaluations.length} {pending.evaluations.length === 1 ? 'evaluación' : 'evaluaciones'}
                {pending.skipped > 0 && ` (${pending.skipped} omitidas por tener un formato inválido)`}.
              </p>
              <p className="mt-1 text-sm text-ink-soft">«Combinar» conserva lo que ya tienes y actualiza las que compartan identificador. «Reemplazar» borra lo actual.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" className="btn btn-primary btn-sm" onClick={() => applyImport('merge')}>
                  Combinar con mis datos
                </button>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => applyImport('replace')}>
                  Reemplazar mis datos
                </button>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setPending(null)}>
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </section>

        <section className="card p-6" aria-labelledby="privacidad">
          <h2 id="privacidad" className="text-xl font-bold">
            Privacidad
          </h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-ink-soft">
            <li>ÉticaLab no tiene servidor, cuentas ni analítica: no envía lo que escribes a ninguna parte.</li>
            <li>No uses datos personales reales de terceros en tus evaluaciones; describe grupos, no personas.</li>
            <li>Quien use este mismo navegador y perfil puede ver tus evaluaciones.</li>
            <li>Las fuentes tipográficas se incluyen en la aplicación; no se descargan de servicios externos.</li>
          </ul>
        </section>

        <section className="card border-risk/30 p-6" aria-labelledby="restablecer">
          <h2 id="restablecer" className="text-xl font-bold">
            Restablecer datos
          </h2>
          <p className="mt-1 text-sm text-ink-soft">Elimina todas las evaluaciones de este navegador. Exporta una copia antes si quieres conservarlas.</p>
          <button type="button" className="btn btn-danger mt-4" onClick={() => setConfirmReset(true)} disabled={list.length === 0}>
            <RotateCcw className="h-4 w-4" aria-hidden /> Restablecer datos
          </button>
        </section>
      </div>

      <ConfirmDialog open={confirmReset} title="¿Restablecer todos los datos?" confirmLabel="Borrar todo" onConfirm={reset} onCancel={() => setConfirmReset(false)}>
        <p>Se eliminarán {list.length} evaluaciones de este navegador. Esta acción no se puede deshacer.</p>
      </ConfirmDialog>
    </div>
  )
}
