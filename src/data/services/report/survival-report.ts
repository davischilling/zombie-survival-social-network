import { IRepository } from '@/data/contracts'
import { ItemModel, UserModel } from '@/domain/models'
import {
  ISurvivalReportService,
  SurvivalReportUseCase,
} from '@/domain/use-cases/report'

export class SurvivalReportService implements ISurvivalReportService {
  constructor(
    private readonly userRepo: IRepository<UserModel>,
    private readonly itemRepo: IRepository<ItemModel>
  ) {}

  async handle(): Promise<SurvivalReportUseCase.output> {
    const allUsers = await this.userRepo.find({})
    return {
      percentageOfInfectedUsers: 0,
      percentageOfNonInfectedUsers: 0,
      averageItemPerUser: [],
      lostPointsByInfectedUser: 0,
    }
  }
}
