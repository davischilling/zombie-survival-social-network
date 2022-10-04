import { Controller, HttpResponse } from '@/application/controllers/Controller'
import { IRemoveItemFromUserService } from '@/domain/use-cases/item'

export class RemoveItemFromUserController extends Controller {
  constructor(
    private readonly removeItemFromUserService: IRemoveItemFromUserService
  ) {
    super()
  }

  async perform(httpRequest: any): Promise<HttpResponse<any>> {
    await this.removeItemFromUserService.handle(httpRequest)
    return {
      statusCode: 200,
      data: { message: 'Item removed from user with success' },
    }
  }
}
