import { IRepository } from '@/data/contracts'
import { ItemPointComparison } from '@/data/utils'
import { ItemModel, UserModel } from '@/domain/models'
import {
  IItemsExchangeService,
  ItemsExchangeUseCase,
} from '@/domain/use-cases/item'

export class ItemsExchangeService implements IItemsExchangeService {
  constructor(
    private readonly userRepo: IRepository<UserModel>,
    private readonly itemRepo: IRepository<ItemModel>
  ) {}

  async handle({
    dealerId,
    dealerItems,
    clientId,
    clientItems,
  }: ItemsExchangeUseCase.input): Promise<void> {
    if (
      dealerItems.some((item) => item.userId !== dealerId) ||
      clientItems.some((item) => item.userId !== clientId)
    ) {
      throw new Error('invalid_item')
    }
    const [dealer, client] = await Promise.all([
      this.userRepo.findById(dealerId),
      this.userRepo.findById(clientId),
    ])
    if (!dealer || !client) {
      throw new Error('not_found')
    }
    if (dealer.isInfected || client.isInfected) {
      throw new Error('invalid_user')
    }
    if (!ItemPointComparison(dealerItems, clientItems)) {
      throw new Error('invalid_exchange')
    }
    const promisesToUpdateItems: any[] = []
    dealerItems.forEach((item) => {
      const { userId, ...itemAttrs } = item
      promisesToUpdateItems.push(
        this.itemRepo.findByIdAndUpdate(item.id, {
          ...itemAttrs,
          userId: clientId,
        })
      )
    })
    clientItems.forEach((item) => {
      const { userId, ...itemAttrs } = item
      promisesToUpdateItems.push(
        this.itemRepo.findByIdAndUpdate(item.id, {
          ...itemAttrs,
          userId: dealerId,
        })
      )
    })
    await Promise.all(promisesToUpdateItems)
  }
}
