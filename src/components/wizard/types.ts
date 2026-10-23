import type { Evaluation } from '../../types'
import type { StepErrors } from '../../utils/validation'

export interface StepProps {
  ev: Evaluation
  update: (patch: Partial<Evaluation>) => void
  errors: StepErrors
}
