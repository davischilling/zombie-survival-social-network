import { IRepository } from '@/data/contracts'
import { ItemsExchangeService } from '@/data/services/user'
import { ItemEnumTypes, UserModel } from '@/domain/models'
import {
  IItemsExchangeService,
  ItemsExchangeDTOType,
} from '@/domain/use-cases/user'
import { faker } from '@faker-js/faker'
import { mock, MockProxy } from 'jest-mock-extended'

import { generateUser } from './mocks/generateUser'

jest.mock('@/data/entities/user')

describe('Items Exchange Service', () => {
  let dealerId: string
  let clientId: string
  let dealerFound: UserModel
  let clientFound: UserModel

  let userRepo: MockProxy<IRepository>
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
          points: faker.datatype.number({
            min: 1,
            max: 4,
          }),
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
          points: faker.datatype.number({
            min: 1,
            max: 4,
          }),
          userId: clientId,
        },
      ],
    }
    userRepo = mock()
    dealerFound = generateUser(dealerId, false)
    clientFound = generateUser(clientId, false)
    userRepo.findById.mockResolvedValue(dealerFound)
    userRepo.findById.mockResolvedValue(clientFound)
  })

  beforeEach(() => {
    sut = new ItemsExchangeService(userRepo)
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
})
