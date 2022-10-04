import { RemoveItemFromUserController } from '@/application/controllers/item'
import { makeRemoveItemFromUserService } from '@/main/factories/services/item'

export const makeRemoveItemFromUserController =
  async (): Promise<RemoveItemFromUserController> => {
    const service = await makeRemoveItemFromUserService()
    return new RemoveItemFromUserController(service)
  }
