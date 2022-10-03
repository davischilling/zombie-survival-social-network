import { IRepository } from '@/data/contracts'
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

  async find(params: any): Promise<{ items: number; data: any[] }> {
    return {} as any
  }
  async findById(id: string): Promise<any> {}
  async findOneByParam(params: any): Promise<any> {}
  async findByIdAndUpdate(id: string, updatedObj: any): Promise<string> {
    return ''
  }
  async findByIdAndDelete(id: string): Promise<void> {}
}
