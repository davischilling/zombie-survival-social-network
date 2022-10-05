import { NotFoundError, ValidationError } from '@/application/errors'
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
    const itemsToFind: any[] = []
    dealerItems.forEach((item) => {
      itemsToFind.push(this.itemRepo.findById(item.id))
    })
    clientItems.forEach((item) => {
      itemsToFind.push(this.itemRepo.findById(item.id))
    })
    const itemsFound = await Promise.all(itemsToFind)
    if (itemsFound.includes(null)) {
      throw new NotFoundError('item')
    }
    if (
      dealerItems.some((item) => item.userId !== dealerId) ||
      clientItems.some((item) => item.userId !== clientId)
    ) {
      throw new ValidationError('invalid_item')
    }
    const [dealer, client] = await Promise.all([
      this.userRepo.findById(dealerId),
      this.userRepo.findById(clientId),
    ])
    if (!dealer || !client) {
      throw new NotFoundError('user')
    }
    if (dealer.isInfected || client.isInfected) {
      throw new ValidationError('invalid_user')
    }
    if (!ItemPointComparison(dealerItems, clientItems)) {
      throw new ValidationError('invalid_exchange')
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
