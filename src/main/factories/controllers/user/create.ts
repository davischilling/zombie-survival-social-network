import { CreateUserController } from '@/application/controllers/user'
import { makeCreateUserService } from '@/main/factories/services/user'

export const makeCreateUserController =
  async (): Promise<CreateUserController> => {
    const service = await makeCreateUserService()
    return new CreateUserController(service)
  }
