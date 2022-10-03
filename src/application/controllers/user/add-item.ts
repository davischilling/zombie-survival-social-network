import { Controller, HttpResponse } from '@/application/controllers/Controller'
import { IAddItemToUserService } from '@/domain/use-cases/user'

export class AddItemToUserController extends Controller {
  constructor(private readonly addItemToUserService: IAddItemToUserService) {
    super()
  }

  async perform(httpRequest: any): Promise<HttpResponse<any>> {
    await this.addItemToUserService.handle(httpRequest)
    return {
      statusCode: 201,
      data: { message: 'Item added to user with success' },
    }
  }
}
