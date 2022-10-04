import { IIdGenerator, IRepository } from '@/data/contracts'
import { UserModel } from '@/domain/models'
import {
  IItemsExchangeService,
  ItemsExchangeUseCase,
} from '@/domain/use-cases/user'

export class ItemsExchangeService implements IItemsExchangeService {
  constructor(private readonly userRepo: IRepository<UserModel>) {}

  async handle({
    dealerId,
    dealerItems,
    clientId,
    clientItems,
  }: ItemsExchangeUseCase.input): Promise<void> {
    const [dealer, client] = await Promise.all([
      this.userRepo.findById(dealerId),
      this.userRepo.findById(clientId),
    ])
  }
}
