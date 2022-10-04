import { ItemsExchangeController } from '@/application/controllers/user'
import { ItemEnumTypes } from '@/domain/models'
import {
  ItemsExchangeDTOType,
  IItemsExchangeService,
} from '@/domain/use-cases/user'
import { faker } from '@faker-js/faker'
import { mock, MockProxy } from 'jest-mock-extended'

describe('Items Exchange Controller', () => {
  let dealerId: string
  let clientId: string
  let itemsExchangeDTO: ItemsExchangeDTOType
  let itemsExchangeService: MockProxy<IItemsExchangeService>
  let sut: ItemsExchangeController

  beforeAll(() => {
    clientId = faker.datatype.uuid()
    dealerId = faker.datatype.uuid()
    itemsExchangeDTO = {
      dealerId,
      dealerItems: [
        {
          id: faker.datatype.uuid(),
          name: faker.helpers.arrayElement([
            ItemEnumTypes.water,
            ItemEnumTypes.medicine,
            ItemEnumTypes.food,
            ItemEnumTypes.ammunition,
          ]),
          points: 4,
          userId: dealerId,
        },
      ],
      clientId,
      clientItems: [
        {
          id: faker.datatype.uuid(),
          name: faker.helpers.arrayElement([
            ItemEnumTypes.water,
            ItemEnumTypes.medicine,
            ItemEnumTypes.food,
            ItemEnumTypes.ammunition,
          ]),
          points: 4,
          userId: clientId,
        },
      ],
    }
    itemsExchangeService = mock()
  })

  beforeEach(() => {
    sut = new ItemsExchangeController(itemsExchangeService)
  })

  it('should call itemsExchangeService.handle with correct params', async () => {
    await sut.perform(itemsExchangeDTO)

    expect(itemsExchangeService.handle).toHaveBeenCalledWith(itemsExchangeDTO)
    expect(itemsExchangeService.handle).toHaveBeenCalledTimes(1)
  })
})
