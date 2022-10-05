/* eslint-disable import/no-import-module-exports */
import { param } from 'express-validator'

export const removeItemValidation = [param('id').exists().isString()]
