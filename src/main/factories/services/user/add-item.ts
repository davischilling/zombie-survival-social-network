import { AddItemToUserService } from '@/data/services/user'
import { IAddItemToUserService } from '@/domain/use-cases/user'
import { makeIdGenerator } from '@/main/factories/infra/id-generator/uuid'
import {
  makeUserRepository,
  makeItemRepository,
} from '@/main/factories/infra/repositories'

export const makeAddItemToUserService =
  async (): Promise<IAddItemToUserService> => {
    const userRepo = makeUserRepository()
    const itemRepo = makeItemRepository()
    const idGenerator = makeIdGenerator()
    return new AddItemToUserService(idGenerator, userRepo, itemRepo)
  }
