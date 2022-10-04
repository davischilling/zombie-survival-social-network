export type MarkUserAsInfectedDTOType = {
  id: string
  snitchOneId: string
  snitchTwoId: string
  snitchThreeId: string
}

export namespace MarkUserAsInfectedUseCase {
  export type input = MarkUserAsInfectedDTOType
}

export type IMarkUserAsInfectedService = {
  handle: (params: MarkUserAsInfectedUseCase.input) => Promise<void>
}
