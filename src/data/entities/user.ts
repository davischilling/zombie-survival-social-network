import { ItemTypes, LocationType, SexTypes, UserModel } from '@/domain/models'

export interface IIdGenerator {
  perform: () => string
}

class User implements UserModel {
  id?: string
  name: string
  age: number
  sex: SexTypes
  location: LocationType
  itens: ItemTypes[]
  isInfected: boolean

  constructor(
    { id, name, age, sex, location, isInfected, itens }: UserModel,
    idGenerator: IIdGenerator
  ) {
    if (!id) {
      this.id = idGenerator.perform()
    } else {
      this.id = id
    }
    this.name = name
    this.age = age
    this.sex = sex
    this.location = location
    this.isInfected = isInfected
    this.itens = itens
  }
}

export default User
