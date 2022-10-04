import { MarkUserAsInfectedService } from '@/data/services/user'
import { IMarkUserAsInfectedService } from '@/domain/use-cases/user'
import { makeIdGenerator } from '@/main/factories/infra/id-generator/uuid'
import { makeUserRepository } from '@/main/factories/infra/repositories'

export const makeMarkUserAsInfectedService =
  async (): Promise<IMarkUserAsInfectedService> => {
    const repo = makeUserRepository()
    const idGenerator = makeIdGenerator()
    return new MarkUserAsInfectedService(idGenerator, repo)
  }
