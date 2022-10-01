import { LocationType, SexTypes } from '@/domain/models'

export type CreateUserDTOType = {
  name: string
  age: number
  sex: SexTypes
  location: LocationType
}

export namespace CreateUserUseCase {
  export type input = CreateUserDTOType
}

export type ICreateUserService = {
  handle: (params: CreateUserUseCase.input) => Promise<void>
}
