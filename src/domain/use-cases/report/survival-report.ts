export type UserAverageReportType = {
  name: string
  averageWater: number
  averageFood: number
  averageMedicine: number
  averageAmmunition: number
}

export type SurvivalReportOutput = {
  percentageOfInfectedUsers: number
  percentageOfNonInfectedUsers: number
  averageItemPerUser: UserAverageReportType[]
  lostPointsByInfectedUser: number
}

export namespace SurvivalReportUseCase {
  export type output = SurvivalReportOutput
}

export type ISurvivalReportService = {
  handle: () => Promise<SurvivalReportUseCase.output>
}
