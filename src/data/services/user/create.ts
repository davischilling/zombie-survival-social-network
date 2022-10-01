import { IIdGenerator } from '@/data/contracts'
import User from '@/data/entities/user'
import {
  CreateUserUseCase,
  ICreateUserService,
} from '@/domain/use-cases/user/create'

export class CreateUserService implements ICreateUserService {
  constructor(private readonly idGenerator: IIdGenerator) {}

  async handle(params: CreateUserUseCase.input): Promise<void> {
    const newUser = new User(params, this.idGenerator)
  }
}
