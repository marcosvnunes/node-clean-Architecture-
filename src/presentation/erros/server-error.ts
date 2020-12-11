export class ServerError extends Error {
  constructor (stack: string) {
    super('Internal server Error')
    this.name = 'ServerError'
    this.stack = stack
  }
}
