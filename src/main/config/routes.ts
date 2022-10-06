import { NotFoundError } from '@/data/errors'
import { Express, NextFunction, Request, Response, Router } from 'express'

export const apiRoutes = async (app: Express) => {
  const router = Router()

  ;(await import('@/main/routes/user')).default(router)
  ;(await import('@/main/routes/item')).default(router)
  ;(await import('@/main/routes/report')).default(router)

  app.use('/zssn-api', router)

  app.use('/zssn-api', async (req: Request, res: Response) => {
    return res.status(200).json({
      message: 'Welcome to the ZSSN (Zombie Survival Social Network) API',
    })
  })

  app.use('*', async (req: Request, res: Response) => {
    return res.status(404).json({ error: new NotFoundError('route').message })
  })

  app.use(
    async (error: Error, req: Request, res: Response, _next: NextFunction) => {
      return res.status(500).json({ error })
    }
  )
}
