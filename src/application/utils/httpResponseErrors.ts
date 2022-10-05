import {
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from '@/application/errors'
import {
  badRequest,
  forbidden,
  HttpResponse,
  notFound,
  serverError,
  unauthorized,
} from '@/application/helpers'

export const httpResponseError = (err: Error): HttpResponse => {
  if (err instanceof ValidationError) {
    return badRequest(err)
  }
  if (err instanceof UnauthorizedError) {
    return unauthorized(err)
  }
  if (err instanceof ForbiddenError) {
    return forbidden(err)
  }
  if (err instanceof NotFoundError) {
    return notFound(err)
  }
  return serverError(err)
}
