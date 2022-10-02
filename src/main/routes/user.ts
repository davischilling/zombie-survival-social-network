import { adaptExpressRoute as adaptCtrl } from '@/main/adapters/express-router'
import { makeCreateUserController } from '@/main/factories/controllers/user'
import { Router } from 'express'

const entityNameRoutes = async (router: Router) => {
  router.post('/users', adaptCtrl(await makeCreateUserController()))
}

export default entityNameRoutes
