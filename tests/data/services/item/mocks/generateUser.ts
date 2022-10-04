import { UserModel } from '@/domain/models'
import { faker } from '@faker-js/faker'

export const generateUser = (): UserModel => ({
  id: faker.datatype.uuid(),
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
  isInfected: faker.datatype.boolean(),
})
