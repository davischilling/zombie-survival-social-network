import { SurvivalReportController } from '@/application/controllers/report'
import {
  ISurvivalReportService,
  SurvivalReportUseCase,
} from '@/domain/use-cases/report'
import { mock, MockProxy } from 'jest-mock-extended'

describe('Survival Report Controller', () => {
  let survivalReportService: MockProxy<ISurvivalReportService>
  let serviceResponse: SurvivalReportUseCase.output
  let sut: SurvivalReportController

  beforeAll(() => {
    serviceResponse = {
      percentageOfNonInfectedUsers: 50,
      percentageOfInfectedUsers: 50,
      averageItemPerUser: [],
      lostPointsByInfectedUser: 5,
    }
    survivalReportService = mock()
    survivalReportService.handle.mockResolvedValue(serviceResponse)
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

  it('should return 200 statusCode and the survival report on success', async () => {
    const httpResponse = await sut.perform()

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: serviceResponse,
    })
  })
})
