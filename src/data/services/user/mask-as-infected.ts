import { IIdGenerator, IRepository } from '@/data/contracts'
import User from '@/data/entities/user'
import { UserModel } from '@/domain/models'
import {
  IMarkUserAsInfectedService,
  MarkUserAsInfectedUseCase,
} from '@/domain/use-cases/user'

export class MarkUserAsInfectedService implements IMarkUserAsInfectedService {
  constructor(
    private readonly idGenerator: IIdGenerator,
    private readonly userRepo: IRepository<UserModel>
  ) {}

  async handle({
    id,
    snitchOneId,
    snitchTwoId,
    snitchThreeId,
  }: MarkUserAsInfectedUseCase.input): Promise<void> {
    const [userToUpdate, snitchOneFound, snitchTwoFound, snitchThreeFound] =
      await Promise.all([
        this.userRepo.findById(id),
        this.userRepo.findById(snitchOneId),
        this.userRepo.findById(snitchTwoId),
        this.userRepo.findById(snitchThreeId),
      ])
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
    await this.userRepo.findByIdAndUpdate(userToUpdate.id, {
      isInfected: true,
      ...userAttrs,
    })
  }
}
