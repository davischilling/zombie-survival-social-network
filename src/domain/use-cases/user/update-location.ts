import { LocationType } from '@/domain/models'

export type UpdateUserLocationDTOType = {
  id: string
  location: LocationType
}

export namespace UpdateUserLocationUseCase {
  export type input = UpdateUserLocationDTOType
}

export type IUpdateUserLocationService = {
  handle: (params: UpdateUserLocationUseCase.input) => Promise<void>
}
