import {
  Authenticate,
  AuthenticateModel,
  LoadAccountByEmailRepository,
  HashComparer,
  TokenGenerator,
  UpdateAccessTokenRepository
} from './db-authenticate-protocols'

export class DbAuthenticate implements Authenticate {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashComparer: HashComparer
  private readonly tokenGenerator: TokenGenerator
  private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  constructor (
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashComparer: HashComparer,
    tokenGenerator: TokenGenerator,
    updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashComparer = hashComparer
    this.tokenGenerator = tokenGenerator
    this.updateAccessTokenRepository = updateAccessTokenRepository
  }

  async auth (authenticate: AuthenticateModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(authenticate.email)
    if (account) {
      const isValid = await this.hashComparer.compare(authenticate.password, account.password)
      if (isValid) {
        const accessToken = await this.tokenGenerator.generate(account.id)
        await this.updateAccessTokenRepository.update(account.id, accessToken)
        return accessToken
      }
    }
    return null
  }
}
