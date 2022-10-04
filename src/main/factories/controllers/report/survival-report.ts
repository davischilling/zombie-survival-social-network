import { SurvivalReportController } from '@/application/controllers/report'
import { makeSurvivalReportService } from '@/main/factories/services/report'

export const makeSurvivalReportController =
  async (): Promise<SurvivalReportController> => {
    const service = await makeSurvivalReportService()
    return new SurvivalReportController(service)
  }
