import { IRepository } from '@/data/contracts'
import { calculatePercentage } from '@/data/utils'
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
    const { percentageOfNonInfectedUsers, percentageOfInfectedUsers } =
      calculatePercentage(allUsers.data)
    const itemsByUserPromises: any[] = []
    allUsers.data.forEach((user) => {
      itemsByUserPromises.push(this.itemRepo.find({ userId: user.id }))
    })
    const itemsByUser = await Promise.all(itemsByUserPromises)
    return {
      percentageOfNonInfectedUsers,
      percentageOfInfectedUsers,
      averageItemPerUser: [],
      lostPointsByInfectedUser: 0,
    }
  }
}
