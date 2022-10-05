import { Controller } from '@/application/controllers/Controller'
import { ServerError, ValidationError } from '@/application/errors'
import { IValidation } from '@/data/contracts'
import { adaptExpressRoute } from '@/main/adapters'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { Request, Response, RequestHandler, NextFunction } from 'express'
import { mock, MockProxy } from 'jest-mock-extended'

describe('ExpressRouter Adapter', () => {
  let sut: RequestHandler
  let req: Request
  let res: Response
  let next: NextFunction
  let controller: MockProxy<Controller>
  let validation: MockProxy<IValidation>

  beforeAll(() => {
    req = getMockReq({ body: { any: 'any_body' }, query: { any: 'any_query' } })
    res = getMockRes().res
    next = getMockRes().next
    validation = mock()
    controller = mock()
    controller.handle.mockResolvedValue({
      statusCode: 200,
      data: { any: 'any' },
    })
  })

  beforeEach(() => {
    sut = adaptExpressRoute(controller, validation)
  })

  it('should call validation.validate with correct request', async () => {
    await sut(req, res, next)

    expect(validation.validate).toHaveBeenCalledWith(req)
    expect(validation.validate).toHaveBeenCalledTimes(1)
  })

  it('should return 400 and validation error if validation.validate returns', async () => {
    validation.validate.mockReturnValueOnce({
      errors: [
        {
          message: 'error_message',
        },
      ],
    })

    await sut(req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith({
      message: 'error_message',
    })
    expect(res.json).toHaveBeenCalledTimes(1)
  })

  it('should call handle with correct request', async () => {
    await sut(req, res, next)

    expect(controller.handle).toHaveBeenCalledWith({ any: 'any_query' })
    expect(controller.handle).toHaveBeenCalledTimes(1)
  })

  it('should call handle with empty request', async () => {
    req = getMockReq()

    await sut(req, res, next)

    expect(controller.handle).toHaveBeenCalledWith({})
    expect(controller.handle).toHaveBeenCalledTimes(1)
  })

  it('should respond with 200 and correct data', async () => {
    await sut(req, res, next)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith({ any: 'any' })
    expect(res.json).toHaveBeenCalledTimes(1)
  })

  it('should respond with 400 and correct error', async () => {
    controller.handle.mockResolvedValueOnce({
      statusCode: 400,
      data: new ValidationError('ctrl_error'),
    })

    await sut(req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith({ error: 'ctrl_error' })
    expect(res.json).toHaveBeenCalledTimes(1)
  })

  it('should respond with 500 and correct error', async () => {
    controller.handle.mockResolvedValueOnce({
      statusCode: 500,
      data: new ServerError(new Error('ctrl_error')),
    })

    await sut(req, res, next)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith({ error: 'ctrl_error' })
    expect(res.json).toHaveBeenCalledTimes(1)
  })
})
