import {
  Authenticate,
  AuthenticateParams,
  LoadAccountByEmailRepository,
  HashComparer,
  Encrypter,
  UpdateAccessTokenRepository
} from './db-authenticate-protocols'

export class DbAuthenticate implements Authenticate {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async auth (authenticate: AuthenticateParams): Promise<string> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(authenticate.email)
    if (account) {
      const isValid = await this.hashComparer.compare(authenticate.password, account.password)
      if (isValid) {
        const accessToken = await this.encrypter.encrypt(account.id)
        await this.updateAccessTokenRepository.updateAccessToken(account.id, accessToken)
        return accessToken
      }
    }
    return null
  }
}
