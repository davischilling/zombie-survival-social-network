import { ItemTypes, LocationType, SexTypes, UserModel } from '@/domain/models'

class User implements UserModel {
  id?: string
  name!: string
  age!: number
  sex!: SexTypes
  location!: LocationType
  itens!: ItemTypes[]
  isInfected!: boolean

  constructor({ name, age, sex, location, isInfected, itens }: UserModel) {
    this.name = name
    this.age = age
    this.sex = sex
    this.location = location
    this.isInfected = isInfected
    this.itens = itens
  }
}

export default User
