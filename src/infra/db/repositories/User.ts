import { IRepository } from '@/data/contracts'
import User from '@/data/entities/user'
import { SexTypes } from '@/domain/models'
import { UserSchema } from '@/infra/db/schemas/User'

export type SqliteUserModel = {
  id: number
  _id: string
  name: string
  age: number
  sex: SexTypes
  latitude: string
  longitude: string
  isInfected: boolean
  createdAt: Date
  updatedAt: Date
}

export class UserRepository implements IRepository {
  static sqliteToDTO(params: SqliteUserModel) {
    const { id, createdAt, updatedAt, _id, latitude, longitude, ...userAttrs } =
      params
    return {
      id: _id,
      location: {
        latitude,
        longitude,
      },
      ...userAttrs,
    }
  }

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
    if (!users) {
      return [] as any
    }
    const usersDTO = users.map((user: any) => {
      const { dataValues } = user
      return UserRepository.sqliteToDTO(dataValues)
    })
    return {
      items: usersDTO.length,
      data: usersDTO,
    }
  }
  async findById(id: string): Promise<User | null> {
    const user: any = await UserSchema.findOne({
      where: { _id: id },
    })
    if (user) {
      const { dataValues } = user
      return UserRepository.sqliteToDTO(dataValues)
    }
    return user
  }
  async findOneByParam(params: any): Promise<User | null> {
    const user: any = await UserSchema.findOne({
      where: { ...params },
    })
    if (user) {
      const { dataValues } = user
      return UserRepository.sqliteToDTO(dataValues)
    }
    return user
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
  async findByIdAndDelete(id: string): Promise<void> {
    await UserSchema.destroy({
      where: { _id: id },
    })
  }
}
