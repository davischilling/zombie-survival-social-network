import { IRepository } from '@/data/contracts'
import { SurvivalReportService } from '@/data/services/report'
import { ItemModel, UserModel } from '@/domain/models'
import { ISurvivalReportService } from '@/domain/use-cases/report'
import { faker } from '@faker-js/faker'
import { mock, MockProxy } from 'jest-mock-extended'

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
})
