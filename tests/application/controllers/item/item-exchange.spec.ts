import { ItemsExchangeController } from '@/application/controllers/item'
import { ItemEnumTypes } from '@/domain/models'
import {
  ItemsExchangeDTOType,
  IItemsExchangeService,
} from '@/domain/use-cases/item'
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

  it('should rethrow if itemsExchangeService.handle throws', async () => {
    itemsExchangeService.handle.mockRejectedValueOnce(
      new Error('service_error')
    )

    const promise = sut.perform(itemsExchangeDTO)

    await expect(promise).rejects.toThrow(new Error('service_error'))
  })

  it('should return 200 statusCode and return confirmation message on success', async () => {
    const httpResponse = await sut.perform(itemsExchangeDTO)

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: { message: 'Items exchange completed with success' },
    })
  })
})
