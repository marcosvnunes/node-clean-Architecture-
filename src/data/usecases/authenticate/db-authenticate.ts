import { Authenticate, AuthenticateModel } from '../../../domain/usercases/authenticate'
import { HashComparer } from '../../protocols/cryptography/hash-comparer'
import { TokenGenerator } from '../../protocols/cryptography/token-generator'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'

export class DbAuthenticate implements Authenticate {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashComparer: HashComparer
  private readonly tokenGenerator: TokenGenerator
  constructor (
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashComparer: HashComparer,
    tokenGenerator: TokenGenerator
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashComparer = hashComparer
    this.tokenGenerator = tokenGenerator
  }

  async auth (authenticate: AuthenticateModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(authenticate.email)
    if (account) {
      await this.hashComparer.compare(authenticate.password, account.password)
      await this.tokenGenerator.generate(account.id)
    }
    return null
  }
}
