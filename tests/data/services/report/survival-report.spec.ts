import { IRepository } from '@/data/contracts'
import { SurvivalReportService } from '@/data/services/report'
import { ItemModel, UserModel } from '@/domain/models'
import { ISurvivalReportService } from '@/domain/use-cases/report'
import { mock, MockProxy } from 'jest-mock-extended'

describe('Survival Report Service', () => {
  let userRepo: MockProxy<IRepository<UserModel>>
  let itemRepo: MockProxy<IRepository<ItemModel>>
  let sut: ISurvivalReportService

  beforeAll(() => {
    userRepo = mock()
    itemRepo = mock()
  })

  beforeEach(() => {
    sut = new SurvivalReportService(userRepo, itemRepo)
  })

  it('should call UserRepo.find with correct params', async () => {
    await sut.handle()

    expect(userRepo.find).toHaveBeenCalledWith({})
    expect(userRepo.find).toHaveBeenCalledTimes(1)
  })
})
