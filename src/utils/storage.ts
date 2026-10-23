import type { Evaluation } from '../types'
import { parseEvaluation } from './validation'

export const STORAGE_KEY = 'eticalab:evaluaciones:v1'

export interface StorageInfo {
  available: boolean
  bytes: number
  count: number
}

type Listener = () => void
const listeners = new Set<Listener>()
let cache: Evaluation[] | null = null
let lastError: string | null = null

function readRaw(): Evaluation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const data: unknown = JSON.parse(raw)
    if (!Array.isArray(data)) return []
    return data.map(parseEvaluation).filter((e): e is Evaluation => e !== null)
  } catch {
    // Datos corruptos o almacenamiento no disponible: se parte de una lista vacía.
    return []
  }
}

export function getEvaluations(): Evaluation[] {
  if (cache === null) cache = readRaw()
  return cache
}

export function getLastStorageError(): string | null {
  return lastError
}

function persist(next: Evaluation[]): boolean {
  cache = next
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    lastError = null
  } catch {
    lastError = 'No se pudo guardar en este navegador. Exporta una copia de seguridad.'
  }
  listeners.forEach((l) => l())
  return lastError === null
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener)
  const onStorage = (ev: StorageEvent) => {
    if (ev.key === STORAGE_KEY || ev.key === null) {
      cache = null
      listener()
    }
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

export function saveEvaluation(ev: Evaluation): boolean {
  const list = getEvaluations()
  const stamped = { ...ev, updatedAt: new Date().toISOString() }
  const exists = list.some((e) => e.id === ev.id)
  return persist(exists ? list.map((e) => (e.id === ev.id ? stamped : e)) : [stamped, ...list])
}

export function deleteEvaluation(id: string): boolean {
  return persist(getEvaluations().filter((e) => e.id !== id))
}

export function replaceAll(list: Evaluation[]): boolean {
  return persist(list)
}

export function mergeEvaluations(incoming: Evaluation[]): boolean {
  const map = new Map(getEvaluations().map((e) => [e.id, e]))
  for (const e of incoming) map.set(e.id, e)
  return persist(Array.from(map.values()))
}

export function resetAll(): boolean {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* sin acceso al almacenamiento */
  }
  return persist([])
}

export function getStorageInfo(): StorageInfo {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) ?? ''
    return { available: true, bytes: new Blob([raw]).size, count: getEvaluations().length }
  } catch {
    return { available: false, bytes: 0, count: getEvaluations().length }
  }
}

/** Solo para pruebas: fuerza una nueva lectura desde localStorage. */
export function _invalidateCache(): void {
  cache = null
}
