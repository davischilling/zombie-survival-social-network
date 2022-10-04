import { IRepository } from '@/data/contracts'
import { SurvivalReportService } from '@/data/services/report'
import { ItemEnumTypes, ItemModel, UserModel } from '@/domain/models'
import { ISurvivalReportService } from '@/domain/use-cases/report'
import { faker } from '@faker-js/faker'
import { mock, MockProxy } from 'jest-mock-extended'

import { generateItem } from './mocks/generateItem'
import { generateUser } from './mocks/generateUser'

describe('Survival Report Service', () => {
  let userRepo: MockProxy<IRepository<UserModel>>
  let itemRepo: MockProxy<IRepository<ItemModel>>
  let firstUser: UserModel
  let secondUser: UserModel
  let thirdUser: UserModel
  let fourthUser: UserModel
  let fifthUser: UserModel

  let sut: ISurvivalReportService

  beforeAll(() => {
    firstUser = generateUser(faker.datatype.uuid(), false)
    secondUser = generateUser(faker.datatype.uuid(), false)
    thirdUser = generateUser(faker.datatype.uuid(), true)
    fourthUser = generateUser(faker.datatype.uuid(), true)
    fifthUser = generateUser(faker.datatype.uuid(), true)

    userRepo = mock()
    itemRepo = mock()
    userRepo.find.mockResolvedValue({
      items: 5,
      data: [firstUser, secondUser, thirdUser, fourthUser, fifthUser],
    })
  })

  beforeEach(() => {
    sut = new SurvivalReportService(userRepo, itemRepo)
  })

  it('should call UserRepo.find with correct params', async () => {
    await sut.handle()

    expect(userRepo.find).toHaveBeenCalledWith({})
    expect(userRepo.find).toHaveBeenCalledTimes(1)
  })

  it('should calculate percentageOfInfectedUsers and percentageOfNonInfectedUsers correctly', async () => {
    const { percentageOfInfectedUsers, percentageOfNonInfectedUsers } =
      await sut.handle()

    expect(percentageOfNonInfectedUsers).toBe(40)
    expect(percentageOfInfectedUsers).toBe(60)
  })

  it('should call itemRepo.find with correct params', async () => {
    await sut.handle()

    expect(itemRepo.find).toHaveBeenCalledWith({ userId: firstUser.id })
    expect(itemRepo.find).toHaveBeenCalledWith({ userId: secondUser.id })
    expect(itemRepo.find).toHaveBeenCalledWith({ userId: thirdUser.id })
    expect(itemRepo.find).toHaveBeenCalledWith({ userId: fourthUser.id })
    expect(itemRepo.find).toHaveBeenCalledWith({ userId: fifthUser.id })
    expect(itemRepo.find).toHaveBeenCalledTimes(5)
  })

  it('should calculate averageItemPerUser correctly', async () => {
    itemRepo.find.mockResolvedValueOnce({
      items: 3,
      data: [
        generateItem(firstUser.id, ItemEnumTypes.water),
        generateItem(firstUser.id, ItemEnumTypes.water),
        generateItem(firstUser.id, ItemEnumTypes.food),
      ],
    })
    itemRepo.find.mockResolvedValueOnce({
      items: 2,
      data: [
        generateItem(secondUser.id, ItemEnumTypes.water),
        generateItem(secondUser.id, ItemEnumTypes.ammunition),
      ],
    })
    itemRepo.find.mockResolvedValueOnce({
      items: 4,
      data: [
        generateItem(thirdUser.id, ItemEnumTypes.medicine),
        generateItem(thirdUser.id, ItemEnumTypes.medicine),
        generateItem(thirdUser.id, ItemEnumTypes.medicine),
        generateItem(thirdUser.id, ItemEnumTypes.food),
      ],
    })
    itemRepo.find.mockResolvedValueOnce({
      items: 6,
      data: [
        generateItem(fourthUser.id, ItemEnumTypes.water),
        generateItem(fourthUser.id, ItemEnumTypes.water),
        generateItem(fourthUser.id, ItemEnumTypes.food),
        generateItem(fourthUser.id, ItemEnumTypes.food),
        generateItem(fourthUser.id, ItemEnumTypes.ammunition),
        generateItem(fourthUser.id, ItemEnumTypes.medicine),
      ],
    })
    itemRepo.find.mockResolvedValueOnce({
      items: 1,
      data: [generateItem(fifthUser.id, ItemEnumTypes.water)],
    })

    const { averageItemPerUser } = await sut.handle()

    expect(averageItemPerUser).toEqual([
      {
        username: firstUser.name,
        averageWater: 0.67,
        averageFood: 0.33,
        averageMedicine: 0,
        averageAmmunition: 0,
      },
      {
        username: secondUser.name,
        averageWater: 0.5,
        averageFood: 0,
        averageMedicine: 0,
        averageAmmunition: 0.5,
      },
      {
        username: thirdUser.name,
        averageWater: 0,
        averageFood: 0.25,
        averageMedicine: 0.75,
        averageAmmunition: 0,
      },
      {
        username: fourthUser.name,
        averageWater: 0.33,
        averageFood: 0.33,
        averageMedicine: 0.17,
        averageAmmunition: 0.17,
      },
      {
        username: fifthUser.name,
        averageWater: 1,
        averageFood: 0,
        averageMedicine: 0,
        averageAmmunition: 0,
      },
    ])
  })
})
