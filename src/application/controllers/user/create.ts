import { Controller, HttpResponse } from '@/application/controllers/Controller'
import { ICreateUserService } from '@/domain/use-cases/user'

export class CreateUserController extends Controller {
  constructor(private readonly createUserService: ICreateUserService) {
    super()
  }

  async perform(httpRequest: any): Promise<HttpResponse<any>> {
    await this.createUserService.handle(httpRequest)
    return {
      statusCode: 201,
      data: { message: 'User created' },
    }
  }
}
