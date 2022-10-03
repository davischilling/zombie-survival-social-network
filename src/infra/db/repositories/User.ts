import { IRepository } from '@/data/contracts'
import User from '@/data/entities/user'
import { UserSchema } from '@/infra/db/schemas/User'

export class UserRepository implements IRepository {
  async create(params: any): Promise<string> {
    const { location, id: _id, ...userAttrs } = params
    const newUser: any = await UserSchema.create({
      _id,
      ...userAttrs,
      ...location,
    })
    return newUser.id
  }
  async find(params: any): Promise<{ items: number; data: User[] }> {
    const users: any = await UserSchema.findAll({
      where: { ...params },
    })
    return {
      items: users.length,
      data: users,
    }
  }
  async findById(id: string): Promise<User> {
    const user = await UserSchema.findOne({
      where: { _id: id },
    })
    return user as any
  }
  async findOneByParam(params: any): Promise<User> {
    const user = await UserSchema.findOne({
      where: { ...params },
    })
    return user as any
  }
  async findByIdAndUpdate(id: string, updatedObj: User): Promise<string> {
    const { id: _id, location, ...userAttrs } = updatedObj
    const { latitude, longitude } = location
    await UserSchema.update(
      {
        ...userAttrs,
        latitude,
        longitude,
      },
      {
        where: { _id: id },
      }
    )
    return id
  }
  async findByIdAndDelete(id: string): Promise<string> {
    return ''
  }
}
