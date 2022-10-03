import { IIdGenerator } from '@/data/contracts'
import { ItemModel, ItemTypes } from '@/domain/models'

export type CreateItemModel = {
  name: ItemTypes
  userId: string
}

class Item implements ItemModel {
  id!: string
  userId!: string
  name!: ItemTypes
  points!: number

  constructor({ name, userId }: CreateItemModel, idGenerator: IIdGenerator) {
    this.id = idGenerator.perform()
    this.name = name
    this.userId = userId
  }
}

export default Item
