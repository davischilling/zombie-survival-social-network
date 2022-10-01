import { Controller } from '@/application/controllers/Controller'
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
})
