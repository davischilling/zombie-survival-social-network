import { HttpResponse, Controller } from '@/application/controllers/Controller'
import { NotFoundError, ServerError } from '@/application/errors'

class ControllerStub extends Controller {
  result: HttpResponse = {
    statusCode: 200,
    data: 'any_data',
  }

  async perform(): Promise<HttpResponse> {
    return this.result
  }
}

describe('Abstract Controller', () => {
  let sut: ControllerStub

  beforeEach(() => {
    sut = new ControllerStub()
  })

  it('should return 404 if perform throws NotFoundError', async () => {
    const error = new NotFoundError('not_found')
    jest.spyOn(sut, 'perform').mockRejectedValueOnce(error)

    const httpResponse = await sut.handle('any_value')

    expect(httpResponse).toEqual({
      statusCode: 404,
      data: error,
    })
  })

  it('should return 500 if perform throws ServerError', async () => {
    const error = new ServerError(new Error('server_error'))
    jest.spyOn(sut, 'perform').mockRejectedValueOnce(error)

    const httpResponse = await sut.handle('any_value')

    expect(httpResponse).toEqual({
      statusCode: 500,
      data: error,
    })
  })

  it('should return same result as perform', async () => {
    const httpResponse = await sut.handle('any_value')

    expect(httpResponse).toEqual(sut.result)
  })
})
