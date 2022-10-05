/* eslint-disable import/no-import-module-exports */
import { ItemEnumTypes } from '@/domain/models'
import { body, param } from 'express-validator'

export const addItemValidation = [
  param('userId').exists().isString(),
  body('name')
    .exists()
    .isString()
    .isIn([
      ItemEnumTypes.water,
      ItemEnumTypes.food,
      ItemEnumTypes.medicine,
      ItemEnumTypes.ammunition,
    ]),
]
