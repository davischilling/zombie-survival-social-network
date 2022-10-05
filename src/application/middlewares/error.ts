import { httpResponseError } from '@/application/utils'
import { IErrorMiddleware } from '@/data/contracts'

export class ErrorResponseMiddleware implements IErrorMiddleware {
  execute(err: Error): { statusCode: number; data: Error } {
    return httpResponseError(err)
  }
}
