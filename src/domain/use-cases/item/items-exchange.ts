import { ItemModel } from '@/domain/models'

export type ItemsExchangeDTOType = {
  dealerId: string
  dealerItems: ItemModel[]
  clientId: string
  clientItems: ItemModel[]
}

export namespace ItemsExchangeUseCase {
  export type input = ItemsExchangeDTOType
}

export type IItemsExchangeService = {
  handle: (params: ItemsExchangeUseCase.input) => Promise<void>
}
