import { IIdGenerator, IRepository } from '@/data/contracts'
import Item from '@/data/entities/Item'
import { ItemModel, UserModel } from '@/domain/models'
import {
  AddItemToUserUseCase,
  IAddItemToUserService,
} from '@/domain/use-cases/item'

export class AddItemToUserService implements IAddItemToUserService {
  constructor(
    private readonly idGenerator: IIdGenerator,
    private readonly userRepo: IRepository<UserModel>,
    private readonly itemRepo: IRepository<ItemModel>
  ) {}

  async handle({ userId, name }: AddItemToUserUseCase.input): Promise<void> {
    const user = await this.userRepo.findById(userId)
    if (!user) {
      throw new Error('not_found')
    }
    const newItem = new Item({ userId, name }, this.idGenerator)
    await this.itemRepo.create(newItem)
  }
}
