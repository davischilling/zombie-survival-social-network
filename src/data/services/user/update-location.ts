import { IIdGenerator, IRepository } from '@/data/contracts'
import User from '@/data/entities/user'
import {
  IUpdateUserLocationService,
  UpdateUserLocationUseCase,
} from '@/domain/use-cases/user'

export class UpdateUserLocationService implements IUpdateUserLocationService {
  constructor(
    private readonly idGenerator: IIdGenerator,
    private readonly userRepo: IRepository
  ) {}

  async handle({
    id,
    location,
  }: UpdateUserLocationUseCase.input): Promise<void> {
    const userFound = await this.userRepo.findById(id)
    if (!userFound) {
      throw new Error('not_found')
    }
    const { location: oldLocation, ...userAttrs } = userFound
    const updatedUser = new User(
      {
        ...userAttrs,
        location,
      },
      this.idGenerator
    )
    await this.userRepo.findByIdAndUpdate(id, updatedUser)
  }
}
