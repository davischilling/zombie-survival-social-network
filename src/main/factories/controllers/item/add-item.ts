import { AddItemToUserController } from '@/application/controllers/item'
import { makeAddItemToUserService } from '@/main/factories/services/item'

export const makeAddItemToUserController =
  async (): Promise<AddItemToUserController> => {
    const service = await makeAddItemToUserService()
    return new AddItemToUserController(service)
  }
