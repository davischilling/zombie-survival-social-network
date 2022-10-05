/* eslint-disable import/no-import-module-exports */
import { ItemEnumTypes } from '@/domain/models'
import { body, query } from 'express-validator'

export const itemExchangeValidation = [
  query('dealerId').exists().isString(),
  query('clientId').exists().isString(),
  body('dealerItems').exists().isArray(),
  body('dealerItems.*.id').exists().isString(),
  body('dealerItems.*.userId').exists().isString(),
  body('dealerItems.*.name')
    .exists()
    .isString()
    .isIn([
      ItemEnumTypes.water,
      ItemEnumTypes.food,
      ItemEnumTypes.medicine,
      ItemEnumTypes.ammunition,
    ]),
  body('dealerItems.*.points').exists().isNumeric(),
  body('clientItems').exists().isArray(),
  body('clientItems.*.id').exists().isString(),
  body('clientItems.*.userId').exists().isString(),
  body('clientItems.*.name')
    .exists()
    .isString()
    .isIn([
      ItemEnumTypes.water,
      ItemEnumTypes.food,
      ItemEnumTypes.medicine,
      ItemEnumTypes.ammunition,
    ]),
  body('clientItems.*.points').exists().isNumeric(),
]
