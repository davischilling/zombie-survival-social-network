import { MarkUserAsInfectedService } from '@/data/services/user'
import { IMarkUserAsInfectedService } from '@/domain/use-cases/user'
import { makeUserRepository } from '@/main/factories/infra/repositories'

export const makeMarkUserAsInfectedService =
  async (): Promise<IMarkUserAsInfectedService> => {
    const repo = makeUserRepository()
    return new MarkUserAsInfectedService(repo)
  }
