import { UserRepository } from '@/infra/db/repositories'

export const makeUserRepository = (): UserRepository => {
  return new UserRepository()
}
