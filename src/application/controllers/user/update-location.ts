import { Controller, HttpResponse } from '@/application/controllers/Controller'
import { IUpdateUserLocationService } from '@/domain/use-cases/user'

export class UpdateUserLocationController extends Controller {
  constructor(
    private readonly updateUserLocationService: IUpdateUserLocationService
  ) {
    super()
  }

  async perform(httpRequest: any): Promise<HttpResponse<any>> {
    await this.updateUserLocationService.handle(httpRequest)
    return {
      statusCode: 200,
      data: { message: 'Updated user location' },
    }
  }
}
