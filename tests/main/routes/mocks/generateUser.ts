/* eslint-disable no-unneeded-ternary */
import { UserModel } from '@/domain/models'
import { faker } from '@faker-js/faker'

export const generateUser = (id: string, isInfected: boolean): UserModel => ({
  id,
  name: faker.name.fullName(),
  age: faker.datatype.number({
    min: 10,
    max: 50,
  }),
  sex: faker.name.sexType(),
  location: {
    latitude: faker.address.latitude(),
    longitude: faker.address.longitude(),
  },
  isInfected,
})
