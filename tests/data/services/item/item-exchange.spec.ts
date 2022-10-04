import { IRepository } from '@/data/contracts'
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
  let dealerFound: UserModel
  let clientFound: UserModel
  let itemRepo: MockProxy<IRepository<ItemModel>>
  let userRepo: MockProxy<IRepository<UserModel>>
  let itemsExchangeDTO: ItemsExchangeDTOType
  let sut: IItemsExchangeService

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
    userRepo = mock()
    itemRepo = mock()
    dealerFound = generateUser(dealerId, false)
    clientFound = generateUser(clientId, false)
    userRepo.findById.mockResolvedValue(dealerFound)
    userRepo.findById.mockResolvedValue(clientFound)
  })

  beforeEach(() => {
    sut = new ItemsExchangeService(userRepo, itemRepo)
  })

  it('should throw invalid_item if a dealer item does not belong to the dealer', async () => {
    const newItemsExchangeDTO = {
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
          userId: faker.datatype.uuid(),
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

    const promise = sut.handle(newItemsExchangeDTO)

    expect(promise).rejects.toThrow(new Error('invalid_item'))
  })

  it('should call UserRepo.findById for each user passing correct params', async () => {
    await sut.handle(itemsExchangeDTO)

    expect(userRepo.findById).toHaveBeenCalledWith(dealerId)
    expect(userRepo.findById).toHaveBeenCalledWith(clientId)
    expect(userRepo.findById).toHaveBeenCalledTimes(2)
  })

  it('should throw not_found error if dealer user was not found', async () => {
    userRepo.findById.mockResolvedValueOnce(null)
    userRepo.findById.mockResolvedValueOnce(clientFound)

    const promise = sut.handle(itemsExchangeDTO)

    expect(promise).rejects.toThrow(new Error('not_found'))
  })

  it('should throw not_found error if client user was not found', async () => {
    userRepo.findById.mockResolvedValueOnce(dealerFound)
    userRepo.findById.mockResolvedValueOnce(null)

    const promise = sut.handle(itemsExchangeDTO)

    expect(promise).rejects.toThrow(new Error('not_found'))
  })

  it('should throw invalid_user error if dealer user is infected', async () => {
    const newDealerFound = generateUser(dealerId, true)
    const newClientFound = generateUser(clientId, false)

    userRepo.findById.mockResolvedValueOnce(newDealerFound)
    userRepo.findById.mockResolvedValueOnce(newClientFound)

    const promise = sut.handle(itemsExchangeDTO)

    expect(promise).rejects.toThrow(new Error('invalid_user'))
  })

  it('should throw invalid_user error if client user is infected', async () => {
    const newDealerFound = generateUser(dealerId, false)
    const newClientFound = generateUser(clientId, true)

    userRepo.findById.mockResolvedValueOnce(newDealerFound)
    userRepo.findById.mockResolvedValueOnce(newClientFound)

    const promise = sut.handle(itemsExchangeDTO)

    expect(promise).rejects.toThrow(new Error('invalid_user'))
  })

  it('should throw invalid_exchange error if client and dealer items dont represent equality of points', async () => {
    const newItemsExchangeDTO = {
      dealerId,
      dealerItems: [
        {
          id: faker.datatype.uuid(),
          name: ItemEnumTypes.water,
          points: 4,
          userId: dealerId,
        },
      ],
      clientId,
      clientItems: [
        {
          id: faker.datatype.uuid(),
          name: ItemEnumTypes.food,
          points: 3,
          userId: clientId,
        },
      ],
    }

    const promise = sut.handle(newItemsExchangeDTO)

    expect(promise).rejects.toThrow(new Error('invalid_exchange'))
  })

  it('should update all items userId field exchanging items between dealer and client', async () => {
    const dealerItemOneId = faker.datatype.uuid()
    const dealerItemTwoId = faker.datatype.uuid()
    const clientItemOneId = faker.datatype.uuid()
    const clientItemTwoId = faker.datatype.uuid()

    const newItemsExchangeDTO = {
      dealerId,
      dealerItems: [
        {
          id: dealerItemOneId,
          name: ItemEnumTypes.water,
          points: 4,
          userId: dealerId,
        },
        {
          id: dealerItemTwoId,
          name: ItemEnumTypes.ammunition,
          points: 1,
          userId: dealerId,
        },
      ],
      clientId,
      clientItems: [
        {
          id: clientItemOneId,
          name: ItemEnumTypes.food,
          points: 3,
          userId: clientId,
        },
        {
          id: clientItemTwoId,
          name: ItemEnumTypes.medicine,
          points: 2,
          userId: clientId,
        },
      ],
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
        id: dealerItemTwoId,
        name: ItemEnumTypes.ammunition,
        points: 1,
        userId: clientId,
      },
      {
        id: clientItemOneId,
        name: ItemEnumTypes.food,
        points: 3,
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
    expect(itemRepo.findByIdAndUpdate).toHaveBeenCalledWith(
      itemsToUpdate[3].id,
      itemsToUpdate[3]
    )
    expect(itemRepo.findByIdAndUpdate).toHaveBeenCalledTimes(4)
  })
})
