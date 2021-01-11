import { AccountModel } from '../../../domain/models/account'
import { LoadAccountByToken } from '../../../domain/usercases/load-accoun-by-token'
import { Decrypter } from '../../protocols/cryptography/decrypter'
import { LoadAccountByTokenRepository } from '../../protocols/db/account/load-account-by-token-repository'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async load (accesstoken: string, role?: string): Promise<AccountModel> {
    const token = await this.decrypter.decrypt(accesstoken)
    if (token) {
      const account = await this.loadAccountByTokenRepository.loadByToken(accesstoken, role)
      if (account) {
        return account
      }
    }
    return new Promise(resolve => resolve(null))
  }
}
