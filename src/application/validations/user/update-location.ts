// eslint-disable-next-line import/no-import-module-exports
import { body, param } from 'express-validator'

export const updateUserLocationValidation = [
  param('id').exists().isString(),
  body('location').exists().isObject(),
  body('location.latitude').exists().isNumeric(),
  body('location.longitude').exists().isNumeric(),
]
