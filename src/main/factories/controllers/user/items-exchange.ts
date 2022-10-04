import { ItemsExchangeController } from '@/application/controllers/user'
import { makeItemsExchangeService } from '@/main/factories/services/user'

export const makeItemsExchangeController =
  async (): Promise<ItemsExchangeController> => {
    const service = await makeItemsExchangeService()
    return new ItemsExchangeController(service)
  }
