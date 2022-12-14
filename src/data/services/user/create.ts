import { IIdGenerator, IRepository } from '@/data/contracts'
import User from '@/data/entities/user'
import { UserModel } from '@/domain/models'
import { CreateUserUseCase, ICreateUserService } from '@/domain/use-cases/user'

export class CreateUserService implements ICreateUserService {
  constructor(
    private readonly idGenerator: IIdGenerator,
    private readonly userRepo: IRepository<UserModel>
  ) {}

  async handle(params: CreateUserUseCase.input): Promise<void> {
    const newUser = new User(params, this.idGenerator)
    await this.userRepo.create(newUser)
  }
}
