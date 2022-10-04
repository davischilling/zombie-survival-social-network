import { SurvivalReportService } from '@/data/services/report'
import { ISurvivalReportService } from '@/domain/use-cases/report'
import {
  makeUserRepository,
  makeItemRepository,
} from '@/main/factories/infra/repositories'

export const makeSurvivalReportService =
  async (): Promise<ISurvivalReportService> => {
    const userRepo = makeUserRepository()
    const itemRepo = makeItemRepository()
    return new SurvivalReportService(userRepo, itemRepo)
  }
