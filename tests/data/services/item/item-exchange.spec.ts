import { IRepository } from '@/data/contracts'
import { NotFoundError, ValidationError } from '@/data/errors'
import { ItemsExchangeService } from '@/data/services/item'
import { ItemEnumTypes, ItemModel, UserModel } from '@/domain/models'
import {
  IItemsExchangeService,
  ItemsExchangeDTOType,
} from '@/domain/use-cases/item'
import { faker } from '@faker-js/faker'
import { mock, MockProxy } from 'jest-mock-extended'

import { generateUser } from './mocks/generateUser'

jest.mock('@/data/entities/user')

describe('Items Exchange Service', () => {
  let dealerId: string
  let clientId: string
  let dealerItem: ItemModel
  let clientItem: ItemModel
  let dealerFound: UserModel
  let clientFound: UserModel
  let itemRepo: MockProxy<IRepository<ItemModel>>
  let userRepo: MockProxy<IRepository<UserModel>>
  let itemsExchangeDTO: ItemsExchangeDTOType
  let sut: IItemsExchangeService

  beforeAll(() => {
    clientId = faker.datatype.uuid()
    dealerId = faker.datatype.uuid()
    dealerItem = {
      id: faker.datatype.uuid(),
      name: faker.helpers.arrayElement([
        ItemEnumTypes.water,
        ItemEnumTypes.medicine,
        ItemEnumTypes.food,
        ItemEnumTypes.ammunition,
      ]),
      points: 4,
      userId: dealerId,
    }
    clientItem = {
      id: faker.datatype.uuid(),
      name: faker.helpers.arrayElement([
        ItemEnumTypes.water,
        ItemEnumTypes.medicine,
        ItemEnumTypes.food,
        ItemEnumTypes.ammunition,
      ]),
      points: 4,
      userId: clientId,
    }
    itemsExchangeDTO = {
      dealerId,
      dealerItems: [dealerItem],
      clientId,
      clientItems: [clientItem],
    }
    userRepo = mock()
    itemRepo = mock()
    dealerFound = generateUser(dealerId, false)
    clientFound = generateUser(clientId, false)
  })

  beforeEach(() => {
    jest.resetAllMocks()
    sut = new ItemsExchangeService(userRepo, itemRepo)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should call itemRepo.findById with correct params', async () => {
    itemRepo.findById.mockResolvedValueOnce(dealerItem)
    itemRepo.findById.mockResolvedValueOnce(clientItem)
    userRepo.findById.mockResolvedValueOnce(dealerFound)
    userRepo.findById.mockResolvedValueOnce(clientFound)

    await sut.handle(itemsExchangeDTO)

    expect(itemRepo.findById).toHaveBeenCalledWith(
      itemsExchangeDTO.dealerItems[0].id
    )
    expect(itemRepo.findById).toHaveBeenCalledWith(
      itemsExchangeDTO.clientItems[0].id
    )
    expect(itemRepo.findById).toHaveBeenCalledTimes(2)
  })

  it('should throw not_found error if one of the items was not found', async () => {
    itemRepo.findById.mockResolvedValueOnce(dealerItem)
    itemRepo.findById.mockResolvedValueOnce(null)
    userRepo.findById.mockResolvedValueOnce(dealerFound)
    userRepo.findById.mockResolvedValueOnce(clientFound)

    const promise = sut.handle(itemsExchangeDTO)

    expect(promise).rejects.toThrow(new NotFoundError('item'))
  })

  it('should throw invalid_item if a dealer item does not belong to the dealer', async () => {
    const newDealerItem = {
      id: faker.datatype.uuid(),
      name: faker.helpers.arrayElement([
        ItemEnumTypes.water,
        ItemEnumTypes.medicine,
        ItemEnumTypes.food,
        ItemEnumTypes.ammunition,
      ]),
      points: 4,
      userId: faker.datatype.uuid(),
    }

    const newClientItem = {
      id: faker.datatype.uuid(),
      name: faker.helpers.arrayElement([
        ItemEnumTypes.water,
        ItemEnumTypes.medicine,
        ItemEnumTypes.food,
        ItemEnumTypes.ammunition,
      ]),
      points: 4,
      userId: clientId,
    }

    itemRepo.findById.mockResolvedValueOnce(newDealerItem)
    itemRepo.findById.mockResolvedValueOnce(newClientItem)
    userRepo.findById.mockResolvedValueOnce(dealerFound)
    userRepo.findById.mockResolvedValueOnce(clientFound)

    const newItemsExchangeDTO = {
      dealerId,
      dealerItems: [newDealerItem],
      clientId,
      clientItems: [newClientItem],
    }

    const promise = sut.handle(newItemsExchangeDTO)

    expect(promise).rejects.toThrow(new ValidationError('invalid_item'))
  })

  it('should throw invalid_item if a client item does not belong to the client', async () => {
    const newDealerItem = {
      id: faker.datatype.uuid(),
      name: faker.helpers.arrayElement([
        ItemEnumTypes.water,
        ItemEnumTypes.medicine,
        ItemEnumTypes.food,
        ItemEnumTypes.ammunition,
      ]),
      points: 4,
      userId: dealerId,
    }

    const newClientItem = {
      id: faker.datatype.uuid(),
      name: faker.helpers.arrayElement([
        ItemEnumTypes.water,
        ItemEnumTypes.medicine,
        ItemEnumTypes.food,
        ItemEnumTypes.ammunition,
      ]),
      points: 4,
      userId: faker.datatype.uuid(),
    }

    itemRepo.findById.mockResolvedValueOnce(newDealerItem)
    itemRepo.findById.mockResolvedValueOnce(newClientItem)
    userRepo.findById.mockResolvedValueOnce(dealerFound)
    userRepo.findById.mockResolvedValueOnce(clientFound)

    const newItemsExchangeDTO = {
      dealerId,
      dealerItems: [newDealerItem],
      clientId,
      clientItems: [newClientItem],
    }

    const promise = sut.handle(newItemsExchangeDTO)

    expect(promise).rejects.toThrow(new ValidationError('invalid_item'))
  })

  it('should call UserRepo.findById for each user passing correct params', async () => {
    itemRepo.findById.mockResolvedValueOnce(dealerItem)
    itemRepo.findById.mockResolvedValueOnce(clientItem)
    userRepo.findById.mockResolvedValueOnce(dealerFound)
    userRepo.findById.mockResolvedValueOnce(clientFound)

    await sut.handle(itemsExchangeDTO)

    expect(userRepo.findById).toHaveBeenCalledWith(dealerId)
    expect(userRepo.findById).toHaveBeenCalledWith(clientId)
    expect(userRepo.findById).toHaveBeenCalledTimes(2)
  })

  it('should throw not_found error if dealer user was not found', async () => {
    itemRepo.findById.mockResolvedValueOnce(dealerItem)
    itemRepo.findById.mockResolvedValueOnce(clientItem)
    userRepo.findById.mockResolvedValueOnce(null)
    userRepo.findById.mockResolvedValueOnce(clientFound)

    const promise = sut.handle(itemsExchangeDTO)

    expect(promise).rejects.toThrow(new NotFoundError('user'))
  })

  it('should throw not_found error if client user was not found', async () => {
    itemRepo.findById.mockResolvedValueOnce(dealerItem)
    itemRepo.findById.mockResolvedValueOnce(clientItem)
    userRepo.findById.mockResolvedValueOnce(dealerFound)
    userRepo.findById.mockResolvedValueOnce(null)

    const promise = sut.handle(itemsExchangeDTO)

    expect(promise).rejects.toThrow(new NotFoundError('user'))
  })

  it('should throw invalid_user error if dealer user is infected', async () => {
    const newDealerFound = generateUser(dealerId, true)
    const newClientFound = generateUser(clientId, false)

    itemRepo.findById.mockResolvedValueOnce(dealerItem)
    itemRepo.findById.mockResolvedValueOnce(clientItem)
    userRepo.findById.mockResolvedValueOnce(newDealerFound)
    userRepo.findById.mockResolvedValueOnce(newClientFound)

    const promise = sut.handle(itemsExchangeDTO)

    expect(promise).rejects.toThrow(new ValidationError('invalid_user'))
  })

  it('should throw invalid_user error if client user is infected', async () => {
    const newDealerFound = generateUser(dealerId, false)
    const newClientFound = generateUser(clientId, true)

    itemRepo.findById.mockResolvedValueOnce(dealerItem)
    itemRepo.findById.mockResolvedValueOnce(clientItem)
    userRepo.findById.mockResolvedValueOnce(newDealerFound)
    userRepo.findById.mockResolvedValueOnce(newClientFound)

    const promise = sut.handle(itemsExchangeDTO)

    expect(promise).rejects.toThrow(new ValidationError('invalid_user'))
  })

  it('should throw invalid_exchange error if client and dealer items dont represent equality of points', async () => {
    const newDealerItem = {
      id: faker.datatype.uuid(),
      name: faker.helpers.arrayElement([
        ItemEnumTypes.water,
        ItemEnumTypes.medicine,
        ItemEnumTypes.food,
        ItemEnumTypes.ammunition,
      ]),
      points: 4,
      userId: dealerId,
    }

    const newClientItem = {
      id: faker.datatype.uuid(),
      name: faker.helpers.arrayElement([
        ItemEnumTypes.water,
        ItemEnumTypes.medicine,
        ItemEnumTypes.food,
        ItemEnumTypes.ammunition,
      ]),
      points: 3,
      userId: clientId,
    }

    const newItemsExchangeDTO = {
      dealerId,
      dealerItems: [newDealerItem],
      clientId,
      clientItems: [newClientItem],
    }

    itemRepo.findById.mockResolvedValueOnce(newDealerItem)
    itemRepo.findById.mockResolvedValueOnce(newClientItem)
    userRepo.findById.mockResolvedValueOnce(dealerFound)
    userRepo.findById.mockResolvedValueOnce(clientFound)

    const promise = sut.handle(newItemsExchangeDTO)

    expect(promise).rejects.toThrow(new ValidationError('invalid_exchange'))
  })

  it('should update all items userId field exchanging items between dealer and client', async () => {
    const dealerItemOneId = faker.datatype.uuid()
    const clientItemOneId = faker.datatype.uuid()
    const clientItemTwoId = faker.datatype.uuid()

    const newDealerItem = {
      id: dealerItemOneId,
      name: ItemEnumTypes.water,
      points: 4,
      userId: dealerId,
    }

    const newClientItemOne = {
      id: clientItemOneId,
      name: ItemEnumTypes.medicine,
      points: 2,
      userId: clientId,
    }

    const newClientItemTwo = {
      id: clientItemTwoId,
      name: ItemEnumTypes.medicine,
      points: 2,
      userId: clientId,
    }

    itemRepo.findById.mockResolvedValueOnce(newDealerItem)
    itemRepo.findById.mockResolvedValueOnce(newClientItemOne)
    itemRepo.findById.mockResolvedValueOnce(newClientItemTwo)

    userRepo.findById.mockResolvedValueOnce(dealerFound)
    userRepo.findById.mockResolvedValueOnce(clientFound)

    const newItemsExchangeDTO = {
      dealerId,
      dealerItems: [newDealerItem],
      clientId,
      clientItems: [newClientItemOne, newClientItemTwo],
    }

    await sut.handle(newItemsExchangeDTO)

    const itemsToUpdate = [
      {
        id: dealerItemOneId,
        name: ItemEnumTypes.water,
        points: 4,
        userId: clientId,
      },
      {
        id: clientItemOneId,
        name: ItemEnumTypes.medicine,
        points: 2,
        userId: dealerId,
      },
      {
        id: clientItemTwoId,
        name: ItemEnumTypes.medicine,
        points: 2,
        userId: dealerId,
      },
    ]

    expect(itemRepo.findByIdAndUpdate).toHaveBeenCalledWith(
      itemsToUpdate[0].id,
      itemsToUpdate[0]
    )
    expect(itemRepo.findByIdAndUpdate).toHaveBeenCalledWith(
      itemsToUpdate[1].id,
      itemsToUpdate[1]
    )
    expect(itemRepo.findByIdAndUpdate).toHaveBeenCalledWith(
      itemsToUpdate[2].id,
      itemsToUpdate[2]
    )
    expect(itemRepo.findByIdAndUpdate).toHaveBeenCalledTimes(3)
  })
})
