import { NotFoundError } from '@/application/errors'
import { IRepository } from '@/data/contracts'
import Item from '@/data/entities/Item'
import { ItemModel, ItemTypes } from '@/domain/models'
import { ItemSchema } from '@/infra/db/schemas/Item'

export type SqliteItemModel = {
  id: number
  _id: string
  userId: string
  name: ItemTypes
  points: number
  createdAt: Date
  updatedAt: Date
}

export class ItemRepository implements IRepository {
  static sqliteToDTO(params: SqliteItemModel) {
    const { id, createdAt, updatedAt, _id, ...userAttrs } = params
    return {
      id: _id,
      ...userAttrs,
    }
  }

  async create({ id: _id, ...itemAttrs }: ItemModel): Promise<string> {
    const newItem: any = await ItemSchema.create({
      _id,
      ...itemAttrs,
    })
    return newItem.id
  }

  async find(params: any): Promise<{ items: number; data: ItemModel[] }> {
    const items: any = await ItemSchema.findAll({
      where: { ...params },
    })
    if (!items) {
      return [] as any
    }
    const itemsDTO = items.map((user: any) => {
      const { dataValues } = user
      return ItemRepository.sqliteToDTO(dataValues)
    })
    return {
      items: itemsDTO.length,
      data: itemsDTO,
    }
  }

  async findById(id: string): Promise<Item | null> {
    const item: any = await ItemSchema.findOne({
      where: { _id: id },
    })
    if (item) {
      const { dataValues } = item
      return ItemRepository.sqliteToDTO(dataValues)
    }
    return item
  }

  async findOneByParam(params: any): Promise<Item | null> {
    const item: any = await ItemSchema.findOne({
      where: { ...params },
    })
    if (item) {
      const { dataValues } = item
      return ItemRepository.sqliteToDTO(dataValues)
    }
    return item
  }

  async findByIdAndUpdate(id: string, updatedObj: Item): Promise<string> {
    const { id: _id, ...itemAttrs } = updatedObj
    await ItemSchema.update(itemAttrs, {
      where: { _id: id },
    })
    return id
  }

  async findByIdAndDelete(id: string): Promise<void> {
    const itemId = await ItemSchema.destroy({
      where: { _id: id },
    })
    if (!itemId) {
      throw new NotFoundError('item')
    }
  }
}
