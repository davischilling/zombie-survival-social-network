import { ItemEnumTypes, ItemModel, ItemTypes } from '@/domain/models'
import { faker } from '@faker-js/faker'

type generateItemProps = {
  userId?: string
  name?: ItemTypes
  points?: number
}

export const generateItem = ({
  name,
  points,
  userId,
}: generateItemProps): ItemModel => ({
  id: faker.datatype.uuid(),
  userId: userId || faker.datatype.uuid(),
  name:
    name ||
    faker.helpers.arrayElement([
      ItemEnumTypes.water,
      ItemEnumTypes.medicine,
      ItemEnumTypes.food,
      ItemEnumTypes.ammunition,
    ]),
  points:
    points ||
    faker.datatype.number({
      min: 1,
      max: 4,
    }),
})
