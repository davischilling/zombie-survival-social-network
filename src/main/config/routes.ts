import { Router, Express } from 'express'

export const apiRoutes = async (app: Express) => {
  const router = Router()

  ;(await import('@/main/routes/user')).default(router)
  ;(await import('@/main/routes/item')).default(router)

  app.use(router)
}
