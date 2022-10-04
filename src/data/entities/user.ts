import { IIdGenerator } from '@/data/contracts'
import { LocationType, SexTypes, UserModel } from '@/domain/models'

type CreateUpdateUserModel = {
  id?: string
  name: string
  age: number
  sex: SexTypes
  location: LocationType
  isInfected?: boolean
}

class User implements UserModel {
  id: string
  name: string
  age: number
  sex: SexTypes
  location: LocationType
  isInfected: boolean

  constructor(
    { id, name, age, sex, location, isInfected }: CreateUpdateUserModel,
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
    this.name = name
    this.age = age
    this.sex = sex
    this.location = location
  }
}

export default User
