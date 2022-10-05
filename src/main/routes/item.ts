import {
  addItemValidation,
  removeItemValidation,
  itemExchangeValidation,
} from '@/application/validations/item'
import expressValidator from '@/infra/validation/express-validator'
import { adaptExpressRoute as adaptCtrl } from '@/main/adapters/express-router'
import {
  makeAddItemToUserController,
  makeItemsExchangeController,
  makeRemoveItemFromUserController,
} from '@/main/factories/controllers/item'
import { Router } from 'express'

const itemRoutes = async (router: Router) => {
  router.post(
    '/items/:userId',
    addItemValidation,
    adaptCtrl(await makeAddItemToUserController(), expressValidator)
  )

  router.delete(
    '/items/:id',
    removeItemValidation,
    adaptCtrl(await makeRemoveItemFromUserController(), expressValidator)
  )

  router.patch(
    '/items/exchange',
    itemExchangeValidation,
    adaptCtrl(await makeItemsExchangeController(), expressValidator)
  )
}

export default itemRoutes
