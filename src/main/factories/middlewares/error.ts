import { ErrorResponseMiddleware } from '@/application/middlewares'

export const makeErrorResponseMiddleware = () => {
  return new ErrorResponseMiddleware()
}
