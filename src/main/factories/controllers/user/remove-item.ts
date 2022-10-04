import { RemoveItemFromUserController } from '@/application/controllers/user'
import { makeRemoveItemFromUserService } from '@/main/factories/services/user'

export const makeRemoveItemFromUserController =
  async (): Promise<RemoveItemFromUserController> => {
    const service = await makeRemoveItemFromUserService()
    return new RemoveItemFromUserController(service)
  }
