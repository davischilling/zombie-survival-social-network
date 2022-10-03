import { ItemTypes } from '@/domain/models'

export type AddItemToUserDTOType = {
  name: ItemTypes
  userId: string
}

export namespace AddItemToUserUseCase {
  export type input = AddItemToUserDTOType
}

export type IAddItemToUserService = {
  handle: (params: AddItemToUserUseCase.input) => Promise<void>
}
