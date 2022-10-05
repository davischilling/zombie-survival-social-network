// eslint-disable-next-line import/no-import-module-exports
import { query, param } from 'express-validator'

export const markUserAsInfectedValidation = [
  param('id').exists().isString(),
  query('snitchOneId').exists().isString(),
  query('snitchTwoId').exists().isString(),
  query('snitchThreeId').exists().isString(),
]
