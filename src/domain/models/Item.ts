export enum ItemEnumTypes {
  water = 'water',
  food = 'food',
  medicine = 'medicine',
  ammunition = 'ammunition',
}

export type ItemTypes = 'water' | 'food' | 'medicine' | 'ammunition'

export type ItemModel = {
  id: string
  userId: string
  name: ItemTypes
  points: number
}
