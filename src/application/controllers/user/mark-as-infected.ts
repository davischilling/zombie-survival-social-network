import { Controller, HttpResponse } from '@/application/controllers/Controller'
import { IMarkUserAsInfectedService } from '@/domain/use-cases/user'

export class MarkUserAsInfectedController extends Controller {
  constructor(
    private readonly markUserAsInfectedService: IMarkUserAsInfectedService
  ) {
    super()
  }

  async perform(httpRequest: any): Promise<HttpResponse<any>> {
    await this.markUserAsInfectedService.handle(httpRequest)
    return {
      statusCode: 200,
      data: {},
    }
  }
}
