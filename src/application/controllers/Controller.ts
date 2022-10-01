export type HttpResponse<T = any> = {
  statusCode: number
  data: T
}

export abstract class Controller {
  abstract perform(httpRequest: any): Promise<HttpResponse>

  async handle(httpRequest: any): Promise<HttpResponse> {
    try {
      await this.perform(httpRequest)
      return {
        statusCode: 200,
        data: {},
      }
    } catch (err: any) {
      if (err.message === 'not_found') {
        return {
          statusCode: 404,
          data: err,
        }
      }
      return {
        statusCode: 500,
        data: {},
      }
    }
  }
}
