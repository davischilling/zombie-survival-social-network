export enum SexEnumTypes {
  female = 'female',
  male = 'male',
}

export type SexTypes = 'female' | 'male'

export type LocationType = {
  latitude: string
  longitude: string
}

export type UserModel = {
  id: string
  name: string
  age: number
  sex: SexTypes
  location: LocationType
  isInfected: boolean
}
