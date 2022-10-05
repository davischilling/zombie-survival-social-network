import { makeErrorResponseMiddleware } from '@/main/factories/middlewares'
import { Router, Express, Request, Response, NextFunction } from 'express'

export const apiRoutes = async (app: Express) => {
  const router = Router()

  ;(await import('@/main/routes/user')).default(router)
  ;(await import('@/main/routes/item')).default(router)
  ;(await import('@/main/routes/report')).default(router)

  app.use(router)

  app.use(
    async (error: Error, req: Request, res: Response, _next: NextFunction) => {
      const errorMiddleware = makeErrorResponseMiddleware()
      const { statusCode, data } = errorMiddleware.execute(error)
      return res.status(statusCode).json({ error: data })
    }
  )
}
