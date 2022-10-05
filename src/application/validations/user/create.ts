/* eslint-disable import/no-import-module-exports */

import { SexEnumTypes } from '@/domain/models'
import { body } from 'express-validator'

export const createUserValidation = [
  body('name').exists().isString(),
  body('age').exists().isNumeric(),
  body('sex')
    .exists()
    .isString()
    .isIn([SexEnumTypes.male, SexEnumTypes.female]),
  body('location').exists().isObject(),
  body('location.latitude').exists().isNumeric(),
  body('location.longitude').exists().isNumeric(),
]
