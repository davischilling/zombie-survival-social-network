import { Controller, HttpResponse } from '@/application/controllers/Controller'
import { ISurvivalReportService } from '@/domain/use-cases/report'

export class SurvivalReportController extends Controller {
  constructor(private readonly survivalReportService: ISurvivalReportService) {
    super()
  }

  async perform(): Promise<HttpResponse<any>> {
    const response = await this.survivalReportService.handle()
    return {
      statusCode: 200,
      data: response,
    }
  }
}
