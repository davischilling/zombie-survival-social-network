import { SurvivalReportController } from '@/application/controllers/report'
import { ISurvivalReportService } from '@/domain/use-cases/report'
import { mock, MockProxy } from 'jest-mock-extended'

describe('Survival Report Controller', () => {
  let survivalReportService: MockProxy<ISurvivalReportService>
  let sut: SurvivalReportController

  beforeAll(() => {
    survivalReportService = mock()
  })

  beforeEach(() => {
    sut = new SurvivalReportController(survivalReportService)
  })

  it('should call survivalReportService.handle with correct params', async () => {
    await sut.perform()

    expect(survivalReportService.handle).toHaveBeenCalledWith()
    expect(survivalReportService.handle).toHaveBeenCalledTimes(1)
  })
})
