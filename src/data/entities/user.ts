import { ItemTypes, LocationType, SexTypes, UserModel } from '@/domain/models'

class User implements UserModel {
  id?: string
  name: string
  age: number
  sex: SexTypes
  location: LocationType
  itens: ItemTypes[]
  isInfected: boolean

  constructor({ id, name, age, sex, location, isInfected, itens }: UserModel) {
    if (!id) {
      this.id = 'new_id'
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
