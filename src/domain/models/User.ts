export enum SexTypes {
  male = 'male',
  female = 'female',
}

export enum ItemTypes {
  water = 'water',
  food = 'food',
  medicine = 'medicine',
  ammunition = 'ammunition',
}

export type LocationType = {
  latitude: number
  longitude: number
}

export type UserModel = {
  id?: string
  name: string
  age: number
  sex: SexTypes
  location: LocationType
  itens: ItemTypes[]
  isInfected: boolean
}
