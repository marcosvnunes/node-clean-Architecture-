import { Authenticate, AuthenticateModel } from '../../../domain/usercases/authenticate'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'

export class DbAuthenticate implements Authenticate {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  constructor (loadAccountByEmailRepository: LoadAccountByEmailRepository) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
  }

  async auth (authenticate: AuthenticateModel): Promise<string> {
    await this.loadAccountByEmailRepository.load(authenticate.email)
    return null
  }
}
