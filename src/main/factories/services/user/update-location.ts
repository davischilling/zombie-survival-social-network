import { UpdateUserLocationService } from '@/data/services/user'
import { IUpdateUserLocationService } from '@/domain/use-cases/user'
import { makeIdGenerator } from '@/main/factories/infra/id-generator/uuid'
import { makeUserRepository } from '@/main/factories/infra/repositories'

export const makeUpdateUserLocationService =
  async (): Promise<IUpdateUserLocationService> => {
    const repo = makeUserRepository()
    const idGenerator = makeIdGenerator()
    return new UpdateUserLocationService(idGenerator, repo)
  }
