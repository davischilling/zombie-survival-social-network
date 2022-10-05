import { Controller } from '@/application/controllers/Controller'
import { IValidation } from '@/data/contracts'
import { RequestHandler } from 'express'

type Adapter = (
  controller: Controller,
  validation: IValidation
) => RequestHandler

export const adaptExpressRoute: Adapter =
  (controller, validation) => async (req, res) => {
    const validationResult = validation.validate(req)
    if (validationResult) {
      return res.status(400).json(validationResult.errors[0])
    }
    const { statusCode, data } = await controller.handle({
      ...req.body,
      ...req.query,
      ...req.params,
    })
    const json =
      statusCode >= 200 && statusCode < 300 ? data : { error: data.message }
    return res.status(statusCode).json(json)
  }
