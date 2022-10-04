import { MarkUserAsInfectedController } from '@/application/controllers/user'
import { makeMarkUserAsInfectedService } from '@/main/factories/services/user'

export const makeMarkUserAsInfectedController =
  async (): Promise<MarkUserAsInfectedController> => {
    const service = await makeMarkUserAsInfectedService()
    return new MarkUserAsInfectedController(service)
  }
