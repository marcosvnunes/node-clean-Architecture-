import {
  Authenticate,
  AuthenticateModel,
  LoadAccountByEmailRepository,
  HashComparer,
  Encrypter,
  UpdateAccessTokenRepository
} from './db-authenticate-protocols'

export class DbAuthenticate implements Authenticate {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashComparer: HashComparer
  private readonly encrypter: Encrypter
  private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  constructor (
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashComparer: HashComparer,
    encrypter: Encrypter,
    updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashComparer = hashComparer
    this.encrypter = encrypter
    this.updateAccessTokenRepository = updateAccessTokenRepository
  }

  async auth (authenticate: AuthenticateModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(authenticate.email)
    if (account) {
      const isValid = await this.hashComparer.compare(authenticate.password, account.password)
      if (isValid) {
        const accessToken = await this.encrypter.encrypt(account.id)
        await this.updateAccessTokenRepository.updateAccessToekn(account.id, accessToken)
        return accessToken
      }
    }
    return null
  }
}
