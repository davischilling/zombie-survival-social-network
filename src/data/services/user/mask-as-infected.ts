import { IIdGenerator, IRepository } from '@/data/contracts'
import User from '@/data/entities/user'
import { UserModel } from '@/domain/models'
import {
  IMarkUserAsInfectedService,
  MarkUserAsInfectedUseCase,
} from '@/domain/use-cases/user'

export class MarkUserAsInfectedService implements IMarkUserAsInfectedService {
  constructor(
    private readonly userRepo: IRepository<UserModel>,
    private readonly idGenerator: IIdGenerator
  ) {}

  async handle({
    id,
    snitchOneId,
    snitchTwoId,
    snitchThreeId,
  }: MarkUserAsInfectedUseCase.input): Promise<void> {
    const userToUpdate = await this.userRepo.findById(id)
    const snitchOneFound = await this.userRepo.findById(snitchOneId)
    const snitchTwoFound = await this.userRepo.findById(snitchTwoId)
    const snitchThreeFound = await this.userRepo.findById(snitchThreeId)
    if (
      !userToUpdate ||
      !snitchOneFound ||
      !snitchTwoFound ||
      !snitchThreeFound
    ) {
      throw new Error('not_found')
    }
    if (
      userToUpdate.isInfected ||
      snitchOneFound.isInfected ||
      snitchTwoFound.isInfected ||
      snitchThreeFound.isInfected
    ) {
      throw new Error('invalid_user')
    }
    const { isInfected, ...userAttrs } = userToUpdate
    const updatedUser = new User(
      { isInfected: true, ...userAttrs },
      this.idGenerator
    )
  }
}
