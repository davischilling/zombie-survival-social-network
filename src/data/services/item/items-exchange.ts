import { IRepository } from '@/data/contracts'
import { NotFoundError, ValidationError } from '@/data/errors'
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
    const dealerItemsToFind: any[] = []
    const clientItemsToFind: any[] = []

    dealerItems.forEach((item) => {
      dealerItemsToFind.push(this.itemRepo.findById(item.id))
    })
    clientItems.forEach((item) => {
      clientItemsToFind.push(this.itemRepo.findById(item.id))
    })

    const dealerItemsFound = await Promise.all(dealerItemsToFind)
    const clientItemsFound = await Promise.all(clientItemsToFind)

    dealerItemsFound.forEach((item) => {
      if (!item) {
        throw new NotFoundError('item')
      }
      if (item.userId !== dealerId) {
        throw new ValidationError('invalid_item')
      }
    })

    clientItemsFound.forEach((item) => {
      if (!item) {
        throw new NotFoundError('item')
      }
      if (item.userId !== clientId) {
        throw new ValidationError('invalid_item')
      }
    })

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

    if (!ItemPointComparison(dealerItemsFound, clientItemsFound)) {
      throw new ValidationError('invalid_exchange')
    }
    const promisesToUpdateItems: any[] = []
    dealerItemsFound.forEach((item) => {
      const { userId, ...itemAttrs } = item
      promisesToUpdateItems.push(
        this.itemRepo.findByIdAndUpdate(item.id, {
          ...itemAttrs,
          userId: clientId,
        })
      )
    })
    clientItemsFound.forEach((item) => {
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
