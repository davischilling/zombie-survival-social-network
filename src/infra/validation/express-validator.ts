import { IValidation } from '@/data/contracts'
import { validationResult } from 'express-validator'

class ExpressValidator implements IValidation {
  validate(request: any): any | null {
    const errorValidation = validationResult(request).isEmpty()

    if (!errorValidation) {
      const validation = validationResult(request)
      return validation
    }
    return null
  }
}

export default new ExpressValidator()
