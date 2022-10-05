import expressValidator from '@/infra/validation/express-validator'
import { adaptExpressRoute as adaptCtrl } from '@/main/adapters/express-router'
import { makeSurvivalReportController } from '@/main/factories/controllers/report'
import { Router } from 'express'

const reportRoutes = async (router: Router) => {
  router.get(
    '/survival-report',
    adaptCtrl(await makeSurvivalReportController(), expressValidator)
  )
}

export default reportRoutes
