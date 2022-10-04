import { adaptExpressRoute as adaptCtrl } from '@/main/adapters/express-router'
import {
  makeAddItemToUserController,
  makeItemsExchangeController,
  makeRemoveItemFromUserController,
} from '@/main/factories/controllers/item'
import { Router } from 'express'

const entityNameRoutes = async (router: Router) => {
  router.post('/items/:userId', adaptCtrl(await makeAddItemToUserController()))

  router.delete(
    '/items/:id',
    adaptCtrl(await makeRemoveItemFromUserController())
  )

  router.patch(
    '/items/exchange',
    adaptCtrl(await makeItemsExchangeController())
  )
}

export default entityNameRoutes
