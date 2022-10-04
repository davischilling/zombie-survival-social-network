import { ItemsExchangeService } from '@/data/services/user'
import { IItemsExchangeService } from '@/domain/use-cases/user'
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
