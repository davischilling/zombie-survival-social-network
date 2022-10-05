import {
  createUserValidation,
  updateUserLocationValidation,
  markUserAsInfectedValidation,
} from '@/application/validations/user'
import expressValidator from '@/infra/validation/express-validator'
import { adaptExpressRoute as adaptCtrl } from '@/main/adapters/express-router'
import {
  makeCreateUserController,
  makeUpdateUserLocationController,
  makeMarkUserAsInfectedController,
} from '@/main/factories/controllers/user'
import { Router } from 'express'

const userRoutes = async (router: Router) => {
  router.post(
    '/users',
    createUserValidation,
    adaptCtrl(await makeCreateUserController(), expressValidator)
  )

  router.patch(
    '/users/:id/location',
    updateUserLocationValidation,
    adaptCtrl(await makeUpdateUserLocationController(), expressValidator)
  )

  router.patch(
    '/users/:id/infected',
    markUserAsInfectedValidation,
    adaptCtrl(await makeMarkUserAsInfectedController(), expressValidator)
  )
}

export default userRoutes
