import { AddItemToUserController } from '@/application/controllers/user'
import { makeAddItemToUserService } from '@/main/factories/services/user'

export const makeAddItemToUserController =
  async (): Promise<AddItemToUserController> => {
    const service = await makeAddItemToUserService()
    return new AddItemToUserController(service)
  }
