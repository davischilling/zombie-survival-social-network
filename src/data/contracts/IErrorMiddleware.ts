export interface IErrorMiddleware {
  execute: (err: Error) => { statusCode: number; data: Error }
}
