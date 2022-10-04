import { ItemsExchangeController } from '@/application/controllers/item'
import { makeItemsExchangeService } from '@/main/factories/services/item'

export const makeItemsExchangeController =
  async (): Promise<ItemsExchangeController> => {
    const service = await makeItemsExchangeService()
    return new ItemsExchangeController(service)
  }
