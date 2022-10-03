import { IIdGenerator } from '@/data/contracts'
import { ItemTypes, LocationType, SexTypes, UserModel } from '@/domain/models'

type CreateUpdateUserModel = {
  id?: string
  name: string
  age: number
  sex: SexTypes
  location: LocationType
  items?: ItemTypes[]
  isInfected?: boolean
}

class User implements UserModel {
  id: string
  name: string
  age: number
  sex: SexTypes
  location: LocationType
  items: ItemTypes[]
  isInfected: boolean

  constructor(
    { id, name, age, sex, location, isInfected, items }: CreateUpdateUserModel,
    idGenerator: IIdGenerator
  ) {
    if (!id) {
      this.id = idGenerator.perform()
    } else {
      this.id = id
    }
    if (!isInfected) {
      this.isInfected = false
    } else {
      this.isInfected = isInfected
    }
    if (!items) {
      this.items = []
    } else {
      this.items = items
    }
    this.name = name
    this.age = age
    this.sex = sex
    this.location = location
  }
}

export default User
