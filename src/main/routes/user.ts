import { adaptExpressRoute as adaptCtrl } from '@/main/adapters/express-router'
import {
  makeCreateUserController,
  makeUpdateUserLocationController,
  makeAddItemToUserController,
} from '@/main/factories/controllers/user'
import { Router } from 'express'

const entityNameRoutes = async (router: Router) => {
  router.post('/users', adaptCtrl(await makeCreateUserController()))

  router.patch(
    '/users/location/:id',
    adaptCtrl(await makeUpdateUserLocationController())
  )

  router.post(
    '/users/:userId/items',
    adaptCtrl(await makeAddItemToUserController())
  )
}

export default entityNameRoutes
