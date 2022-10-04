import { adaptExpressRoute as adaptCtrl } from '@/main/adapters/express-router'
import {
  makeCreateUserController,
  makeUpdateUserLocationController,
} from '@/main/factories/controllers/user'
import { Router } from 'express'

const entityNameRoutes = async (router: Router) => {
  router.post('/users', adaptCtrl(await makeCreateUserController()))

  router.patch(
    '/users/location/:id',
    adaptCtrl(await makeUpdateUserLocationController())
  )
}

export default entityNameRoutes
