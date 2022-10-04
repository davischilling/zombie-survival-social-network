import { ItemModel } from '@/domain/models'

export const ItemPointComparison = (
  dealerItems: ItemModel[],
  clientItems: ItemModel[]
) => {
  const dealerItemsPoints = dealerItems.reduce((previous, current) => {
    // eslint-disable-next-line no-param-reassign
    previous += current.points
    return previous
  }, 0)
  const clientItemsPoints = clientItems.reduce((previous, current) => {
    // eslint-disable-next-line no-param-reassign
    previous += current.points
    return previous
  }, 0)
  return dealerItemsPoints === clientItemsPoints
}
