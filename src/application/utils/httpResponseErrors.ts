import {
  badRequest,
  HttpResponse,
  notFound,
  serverError,
} from '@/application/helpers'
import { NotFoundError, ValidationError } from '@/data/errors'

export const httpResponseError = (err: Error): HttpResponse => {
  if (err instanceof ValidationError) {
    return badRequest(err)
  }
  if (err instanceof NotFoundError) {
    return notFound(err)
  }
  return serverError(err)
}
