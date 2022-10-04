import { RemoveItemFromUserService } from '@/data/services/item'
import { IRemoveItemFromUserService } from '@/domain/use-cases/item'
import { makeItemRepository } from '@/main/factories/infra/repositories'

export const makeRemoveItemFromUserService =
  async (): Promise<IRemoveItemFromUserService> => {
    const itemRepo = makeItemRepository()
    return new RemoveItemFromUserService(itemRepo)
  }
