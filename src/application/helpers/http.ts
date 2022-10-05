import {
  ForbiddenError,
  NotFoundError,
  ServerError,
  UnauthorizedError,
  ValidationError,
} from '@/application/errors'

export type HttpResponse<T = any> = {
  statusCode: number
  data: T
}

export const ok = <T = any>(data: T): HttpResponse<T> => ({
  statusCode: 200,
  data,
})

export const created = <T = any>(message: T): HttpResponse<T> => ({
  statusCode: 201,
  data: message,
})

export const badRequest = (
  error: ValidationError
): HttpResponse<ValidationError> => ({
  statusCode: 400,
  data: error,
})

export const unauthorized = (
  error: UnauthorizedError
): HttpResponse<UnauthorizedError> => ({
  statusCode: 401,
  data: error,
})

export const forbidden = (
  error: ForbiddenError
): HttpResponse<ForbiddenError> => ({
  statusCode: 403,
  data: error,
})

export const notFound = (
  error: NotFoundError
): HttpResponse<NotFoundError> => ({
  statusCode: 404,
  data: error,
})

export const serverError = (error: ServerError): HttpResponse<ServerError> => ({
  statusCode: 500,
  data: error,
})
