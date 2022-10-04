import { ItemEnumTypes, ItemModel } from '@/domain/models'
import { faker } from '@faker-js/faker'

export const generateItem = (
  userId = faker.datatype.uuid(),
  name = faker.helpers.arrayElement([
    ItemEnumTypes.water,
    ItemEnumTypes.medicine,
    ItemEnumTypes.food,
    ItemEnumTypes.ammunition,
  ]),
  points = faker.datatype.number({
    min: 1,
    max: 4,
  })
): ItemModel => ({
  id: faker.datatype.uuid(),
  name,
  points,
  userId,
})
