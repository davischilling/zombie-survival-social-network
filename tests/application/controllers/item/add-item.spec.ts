import { AddItemToUserController } from '@/application/controllers/item'
import { ServerError } from '@/application/errors'
import { serverError } from '@/application/helpers'
import { ItemEnumTypes } from '@/domain/models'
import {
  AddItemToUserDTOType,
  IAddItemToUserService,
} from '@/domain/use-cases/item'
import { faker } from '@faker-js/faker'
import { mock, MockProxy } from 'jest-mock-extended'

describe('Add Item to User Controller', () => {
  let addItemToUserDTO: AddItemToUserDTOType
  let addItemToUserService: MockProxy<IAddItemToUserService>
  let sut: AddItemToUserController

  beforeAll(() => {
    addItemToUserDTO = {
      userId: faker.datatype.uuid(),
      name: faker.helpers.arrayElement([
        ItemEnumTypes.water,
        ItemEnumTypes.medicine,
        ItemEnumTypes.food,
        ItemEnumTypes.ammunition,
      ]),
    }
    addItemToUserService = mock()
  })

  beforeEach(() => {
    sut = new AddItemToUserController(addItemToUserService)
  })

  it('should call addItemToUserService.handle with correct params', async () => {
    await sut.perform(addItemToUserDTO)

    expect(addItemToUserService.handle).toHaveBeenCalledWith(addItemToUserDTO)
    expect(addItemToUserService.handle).toHaveBeenCalledTimes(1)
  })

  it('should rethrow if addItemToUserService.handle throws', async () => {
    const error = new ServerError(new Error('server_error'))
    addItemToUserService.handle.mockRejectedValueOnce(error)

    const promise = sut.perform(addItemToUserDTO)

    await expect(promise).rejects.toThrow(error)
  })

  it('should return 201 statusCode and add item to user confirmation message on success', async () => {
    const httpResponse = await sut.perform(addItemToUserDTO)

    expect(httpResponse).toEqual({
      statusCode: 201,
      data: { message: 'Item added to user with success' },
    })
  })
})
