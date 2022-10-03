import { IIdGenerator, IRepository } from '@/data/contracts'
import { AddItemToUserService } from '@/data/services/user'
import { ItemEnumTypes, UserModel } from '@/domain/models'
import {
  AddItemToUserUseCase,
  IAddItemToUserService,
} from '@/domain/use-cases/user'
import { faker } from '@faker-js/faker'
// eslint-disable-next-line import/no-extraneous-dependencies
import { mock, MockProxy } from 'jest-mock-extended'

import { generateUser } from './mocks/generateUser'

jest.mock('@/data/entities/user')

describe('Add Item to User Service', () => {
  let userRepo: MockProxy<IRepository<UserModel>>
  let idGenerator: MockProxy<IIdGenerator>
  let addItemToUserDTO: AddItemToUserUseCase.input
  let sut: IAddItemToUserService
  let userFound: UserModel

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
    userFound = generateUser()
    userRepo = mock()
    idGenerator = mock()
    userRepo.findById.mockResolvedValue(userFound)
  })

  beforeEach(() => {
    sut = new AddItemToUserService(idGenerator, userRepo)
  })

  it('should call UserRepo.findById with correct params', async () => {
    await sut.handle(addItemToUserDTO)

    expect(userRepo.findById).toHaveBeenCalledWith(addItemToUserDTO.userId)
    expect(userRepo.findById).toHaveBeenCalledTimes(1)
  })
})
