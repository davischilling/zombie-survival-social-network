import { IRepository } from '@/data/contracts'
import { ItemModel } from '@/domain/models'
import {
  IRemoveItemFromUserService,
  RemoveItemFromUserUseCase,
} from '@/domain/use-cases/item'

export class RemoveItemFromUserService implements IRemoveItemFromUserService {
  constructor(private readonly itemRepo: IRepository<ItemModel>) {}

  async handle({ id }: RemoveItemFromUserUseCase.input): Promise<void> {
    await this.itemRepo.findByIdAndDelete(id)
  }
}
