import { HttpResponse, Controller } from '@/application/controllers/Controller'

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

  it('should return 404 if perform throws', async () => {
    const error = new Error('not_found')
    jest.spyOn(sut, 'perform').mockRejectedValueOnce(error)

    const httpResponse = await sut.handle('any_value')

    expect(httpResponse).toEqual({
      statusCode: 404,
      data: error,
    })
  })
})
