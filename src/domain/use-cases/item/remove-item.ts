export type RemoveItemFromUserDTOType = {
  id: string
}

export namespace RemoveItemFromUserUseCase {
  export type input = RemoveItemFromUserDTOType
}

export type IRemoveItemFromUserService = {
  handle: (params: RemoveItemFromUserUseCase.input) => Promise<void>
}
