export class NotFoundError extends Error {
  constructor(entity: string) {
    super(`${entity.toUpperCase()} not_found`)
    this.name = 'NotFoundError'
  }
}
