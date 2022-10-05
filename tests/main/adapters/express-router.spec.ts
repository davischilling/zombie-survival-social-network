import { Controller } from '@/application/controllers/Controller'
import { ServerError, ValidationError } from '@/application/errors'
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

  beforeAll(() => {
    req = getMockReq({ body: { any: 'any_body' }, query: { any: 'any_query' } })
    res = getMockRes().res
    next = getMockRes().next
    controller = mock()
    controller.handle.mockResolvedValue({
      statusCode: 200,
      data: { any: 'any' },
    })
  })

  beforeEach(() => {
    sut = adaptExpressRoute(controller)
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
