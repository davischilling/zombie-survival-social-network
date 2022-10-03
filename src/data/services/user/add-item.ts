import { IIdGenerator, IRepository } from '@/data/contracts'
import User from '@/data/entities/user'
import {
  AddItemToUserUseCase,
  IAddItemToUserService,
} from '@/domain/use-cases/user'

export class AddItemToUserService implements IAddItemToUserService {
  constructor(
    private readonly idGenerator: IIdGenerator,
    private readonly userRepo: IRepository
  ) {}

  async handle({ userId }: AddItemToUserUseCase.input): Promise<void> {
    await this.userRepo.findById(userId)
  }
}
