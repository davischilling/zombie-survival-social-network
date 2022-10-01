import { Controller } from '@/application/controllers/Controller'
import { RequestHandler } from 'express'

type Adapter = (controller: Controller) => RequestHandler

export const adaptExpressRoute: Adapter = (controller) => async (req, res) => {
  await controller.handle({
    ...req.body,
    ...req.query,
    ...req.params,
  })
}
