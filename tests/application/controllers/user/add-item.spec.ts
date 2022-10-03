import { AddItemToUserController } from '@/application/controllers/user'
import { ItemEnumTypes } from '@/domain/models'
import {
  AddItemToUserDTOType,
  IAddItemToUserService,
} from '@/domain/use-cases/user'
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
})
