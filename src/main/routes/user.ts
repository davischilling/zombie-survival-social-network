import { adaptExpressRoute as adaptCtrl } from '@/main/adapters/express-router'
import {
  makeCreateUserController,
  makeUpdateUserLocationController,
  makeMarkUserAsInfectedController,
} from '@/main/factories/controllers/user'
import { Router } from 'express'

const entityNameRoutes = async (router: Router) => {
  router.post('/users', adaptCtrl(await makeCreateUserController()))

  router.patch(
    '/users/:id/location',
    adaptCtrl(await makeUpdateUserLocationController())
  )

  router.patch(
    '/users/:id/infected',
    adaptCtrl(await makeMarkUserAsInfectedController())
  )
}

export default entityNameRoutes
