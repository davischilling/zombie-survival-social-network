import { IIdGenerator, IRepository } from '@/data/contracts'
import Item from '@/data/entities/Item'
import { NotFoundError, ServerError } from '@/data/errors'
import { AddItemToUserService } from '@/data/services/item'
import { ItemEnumTypes, ItemModel, UserModel } from '@/domain/models'
import {
  AddItemToUserUseCase,
  IAddItemToUserService,
} from '@/domain/use-cases/item'
import { faker } from '@faker-js/faker'
import { mock, MockProxy } from 'jest-mock-extended'

import { generateUser } from './mocks/generateUser'

jest.mock('@/data/entities/Item')

describe('Add Item to User Service', () => {
  let userRepo: MockProxy<IRepository<UserModel>>
  let itemRepo: MockProxy<IRepository<ItemModel>>
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
    itemRepo = mock()
    idGenerator = mock()
    userRepo.findById.mockResolvedValue(userFound)
  })

  beforeEach(() => {
    sut = new AddItemToUserService(idGenerator, userRepo, itemRepo)
  })

  it('should call UserRepo.findById with correct params', async () => {
    await sut.handle(addItemToUserDTO)

    expect(userRepo.findById).toHaveBeenCalledWith(addItemToUserDTO.userId)
    expect(userRepo.findById).toHaveBeenCalledTimes(1)
  })

  it('should throw if userRepo.findById does not find any collection', async () => {
    userRepo.findById.mockResolvedValueOnce(null)

    const promise = sut.handle(addItemToUserDTO)

    expect(promise).rejects.toThrow(new NotFoundError('user'))
  })

  it('Should call Item class constructor with correct params', async () => {
    await sut.handle(addItemToUserDTO)

    expect(Item).toHaveBeenCalledWith(addItemToUserDTO, idGenerator)
    expect(Item).toHaveBeenCalledTimes(1)
  })

  it('should call itemRepo.create with correct params', async () => {
    await sut.handle(addItemToUserDTO)

    const newItem = new Item(addItemToUserDTO, idGenerator)

    expect(itemRepo.create).toHaveBeenCalledWith(newItem)
    expect(itemRepo.create).toHaveBeenCalledTimes(1)
  })

  it('should rethrow if userRepo throws', async () => {
    const error = new ServerError(new Error('userRepo_findById__error'))
    userRepo.findById.mockRejectedValueOnce(error)

    const findByIdPromise = sut.handle(addItemToUserDTO)

    await expect(findByIdPromise).rejects.toThrow(error)
  })

  it('should rethrow if itemRepo throws', async () => {
    const error = new ServerError(new Error('itemRepo_create_error'))
    itemRepo.create.mockRejectedValueOnce(error)

    const createItemPromise = sut.handle(addItemToUserDTO)

    await expect(createItemPromise).rejects.toThrow(error)
  })
})
