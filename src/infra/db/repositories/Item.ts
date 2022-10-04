import { IRepository } from '@/data/contracts'
import Item from '@/data/entities/Item'
import { ItemModel } from '@/domain/models'
import { ItemSchema } from '@/infra/db/schemas/Item'

export class ItemRepository implements IRepository {
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
    return {
      items: items.length,
      data: items,
    }
  }
  async findById(id: string): Promise<any> {}
  async findOneByParam(params: any): Promise<any> {}

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
      throw new Error('not_found')
    }
  }
}
