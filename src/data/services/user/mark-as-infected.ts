import { IRepository } from '@/data/contracts'
import { NotFoundError, ValidationError } from '@/data/errors'
import { areThereToEqualIds } from '@/data/utils'
import { UserModel } from '@/domain/models'
import {
  IMarkUserAsInfectedService,
  MarkUserAsInfectedUseCase,
} from '@/domain/use-cases/user'

export class MarkUserAsInfectedService implements IMarkUserAsInfectedService {
  constructor(private readonly userRepo: IRepository<UserModel>) {}

  async handle({
    id,
    snitchOneId,
    snitchTwoId,
    snitchThreeId,
  }: MarkUserAsInfectedUseCase.input): Promise<void> {
    if (areThereToEqualIds([id, snitchOneId, snitchTwoId, snitchThreeId])) {
      throw new ValidationError('invalid_user')
    }
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
      throw new NotFoundError('user')
    }
    if (
      userToUpdate.isInfected ||
      snitchOneFound.isInfected ||
      snitchTwoFound.isInfected ||
      snitchThreeFound.isInfected
    ) {
      throw new ValidationError('invalid_user')
    }
    const { isInfected, ...userAttrs } = userToUpdate
    await this.userRepo.findByIdAndUpdate(userToUpdate.id, {
      isInfected: true,
      ...userAttrs,
    })
  }
}
