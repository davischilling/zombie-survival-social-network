import { Controller, HttpResponse } from '@/application/controllers/Controller'
import { IItemsExchangeService } from '@/domain/use-cases/item'

export class ItemsExchangeController extends Controller {
  constructor(private readonly itemsExchangeService: IItemsExchangeService) {
    super()
  }

  async perform(httpRequest: any): Promise<HttpResponse<any>> {
    await this.itemsExchangeService.handle(httpRequest)
    return {
      statusCode: 200,
      data: { message: 'Items exchange completed with success' },
    }
  }
}
