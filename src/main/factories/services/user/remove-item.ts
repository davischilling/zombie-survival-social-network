import { RemoveItemFromUserService } from '@/data/services/user'
import { IRemoveItemFromUserService } from '@/domain/use-cases/user'
import { makeItemRepository } from '@/main/factories/infra/repositories'

export const makeRemoveItemFromUserService =
  async (): Promise<IRemoveItemFromUserService> => {
    const itemRepo = makeItemRepository()
    return new RemoveItemFromUserService(itemRepo)
  }
