export enum SexEnumTypes {
  female = 'female',
  male = 'male',
}

export type SexTypes = 'female' | 'male'

export enum ItemEnumTypes {
  water = 'water',
  food = 'food',
  medicine = 'medicine',
  ammunition = 'ammunition',
}

export type ItemTypes = 'water' | 'food' | 'medicine' | 'ammunition'

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
  items: ItemTypes[]
  isInfected: boolean
}
