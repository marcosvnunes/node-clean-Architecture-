export class EmailAlreadyInUse extends Error {
  constructor () {
    super('email provided is already in use')
    this.name = 'EmailAlreadyInUse'
  }
}
