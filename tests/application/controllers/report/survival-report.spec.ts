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

  it('should rethrow if survivalReportService.handle throws', async () => {
    survivalReportService.handle.mockRejectedValueOnce(
      new Error('service_error')
    )

    const promise = sut.perform()

    await expect(promise).rejects.toThrow(new Error('service_error'))
  })
})
