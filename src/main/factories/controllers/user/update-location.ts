import { UpdateUserLocationController } from '@/application/controllers/user'
import { makeUpdateUserLocationService } from '@/main/factories/services/user'

export const makeUpdateUserLocationController =
  async (): Promise<UpdateUserLocationController> => {
    const service = await makeUpdateUserLocationService()
    return new UpdateUserLocationController(service)
  }
