import { ItemsExchangeService } from '@/data/services/item'
import { IItemsExchangeService } from '@/domain/use-cases/item'
import {
  makeItemRepository,
  makeUserRepository,
} from '@/main/factories/infra/repositories'

export const makeItemsExchangeService =
  async (): Promise<IItemsExchangeService> => {
    const userRepo = makeUserRepository()
    const itemRepo = makeItemRepository()
    return new ItemsExchangeService(userRepo, itemRepo)
  }
