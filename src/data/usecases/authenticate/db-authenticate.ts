import { Authenticate, AuthenticateModel } from '../../../domain/usercases/authenticate'
import { HashComparer } from '../../protocols/cryptography/hash-comparer'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'

export class DbAuthenticate implements Authenticate {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashComparer: HashComparer
  constructor (loadAccountByEmailRepository: LoadAccountByEmailRepository, hashComparer: HashComparer) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashComparer = hashComparer
  }

  async auth (authenticate: AuthenticateModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(authenticate.email)
    if (account) {
      await this.hashComparer.compare(authenticate.password, account.password)
    }
    return null
  }
}
