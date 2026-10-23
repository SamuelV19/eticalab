import { useSyncExternalStore } from 'react'
import { getEvaluations, subscribe } from '../utils/storage'
import type { Evaluation } from '../types'

export function useEvaluations(): Evaluation[] {
  return useSyncExternalStore(subscribe, getEvaluations, getEvaluations)
}

export function useEvaluation(id: string | undefined): Evaluation | undefined {
  const list = useEvaluations()
  return id ? list.find((e) => e.id === id) : undefined
}
