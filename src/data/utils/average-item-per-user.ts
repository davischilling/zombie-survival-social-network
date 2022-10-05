/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
import { ItemEnumTypes, ItemModel, ItemTypes, UserModel } from '@/domain/models'
import { UserAverageReportType } from '@/domain/use-cases/report'

const itemTypeAverage = (
  type: ItemTypes,
  items: { items: number; data: ItemModel[] } | null
) => {
  if (!items) {
    return 0
  }
  const itemAmount = items.data.reduce((previous, current) => {
    if (current.name === type) {
      previous += 1
    }
    return previous
  }, 0)
  return Number((itemAmount / items.data.length).toFixed(2))
}

export const calculateAverageItemPerUser = (
  allUsers: UserModel[],
  itemsByUsers: any
) => {
  const averageItemPerUser: UserAverageReportType[] = []
  for (let i = 0; i < allUsers.length; i++) {
    const averageWater = itemTypeAverage(ItemEnumTypes.water, itemsByUsers[i])
    const averageFood = itemTypeAverage(ItemEnumTypes.food, itemsByUsers[i])
    const averageMedicine = itemTypeAverage(
      ItemEnumTypes.medicine,
      itemsByUsers[i]
    )
    const averageAmmunition = itemTypeAverage(
      ItemEnumTypes.ammunition,
      itemsByUsers[i]
    )

    averageItemPerUser.push({
      username: allUsers[i].name,
      averageWater: averageWater || 0,
      averageFood: averageFood || 0,
      averageMedicine: averageMedicine || 0,
      averageAmmunition: averageAmmunition || 0,
    })
  }
  return { averageItemPerUser }
}
