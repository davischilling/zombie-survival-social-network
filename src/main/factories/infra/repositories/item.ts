import { ItemRepository } from '@/infra/db/repositories'

export const makeItemRepository = (): ItemRepository => {
  return new ItemRepository()
}
