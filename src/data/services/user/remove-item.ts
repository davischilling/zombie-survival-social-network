import { IRepository } from '@/data/contracts'
import {
  IRemoveItemFromUserService,
  RemoveItemFromUserUseCase,
} from '@/domain/use-cases/user'

export class RemoveItemFromUserService implements IRemoveItemFromUserService {
  constructor(private readonly itemRepo: IRepository) {}

  async handle({ id }: RemoveItemFromUserUseCase.input): Promise<void> {
    await this.itemRepo.findByIdAndDelete(id)
  }
}
