import { IRepository } from '@/data/contracts'
import User from '@/data/entities/user'
import LocationSchema from '@/infra/db/schemas/Location'
import UserSchema from '@/infra/db/schemas/User'

export class UserRepository implements IRepository {
  async create(params: any): Promise<string | null> {
    const { location, ...userAttrs } = params
    const newUser: any = await UserSchema.create(userAttrs, {
      fields: ['id', 'name', 'age', 'sex', 'items', 'isInfected'],
    })
    const { latitude, longitude } = location
    await LocationSchema.create(
      { latitude, longitude },
      {
        fields: ['latitude', 'longitude'],
      }
    )
    return newUser.id
  }
  async find(params: any): Promise<{ items: number; data: User[] }> {
    const users: any = await UserSchema.findAll({
      attributes: ['id', 'name', 'age', 'sex', 'items', 'isInfected'],
      where: { ...params },
    })
    return {
      items: users.length,
      data: users,
    }
  }
  async findById(id: string): Promise<User> {
    return {} as User
  }
  async findOneByParam(param: any): Promise<User> {
    return {} as User
  }
  async findByIdAndUpdate(
    id: string,
    updatedObj: User
  ): Promise<string | null> {
    return ''
  }
  async findByIdAndDelete(id: string): Promise<string | null> {
    return ''
  }
}
