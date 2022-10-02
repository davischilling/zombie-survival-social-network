import { CreateUserService } from '@/data/services/user'
import { ICreateUserService } from '@/domain/use-cases/user'
import { makeIdGenerator } from '@/main/factories/infra/id-generator/uuid'
import { makeUserRepository } from '@/main/factories/infra/repositories'

export const makeCreateUserService = async (): Promise<ICreateUserService> => {
  const repo = makeUserRepository()
  const idGenerator = makeIdGenerator()
  return new CreateUserService(idGenerator, repo)
}
