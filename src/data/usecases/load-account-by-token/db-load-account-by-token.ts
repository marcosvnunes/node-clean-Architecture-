import { AccountModel } from '../../../domain/models/account'
import { LoadAccountByToken } from '../../../domain/usercases/load-accoun-by-token'
import { Decrypter } from '../../protocols/cryptography/decrypter'
import { LoadAccountByTokenRepository } from '../../protocols/db/account/load-account-by-token-repository'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async load (token: string, role?: string): Promise<AccountModel> {
    await this.decrypter.decrypt(token)
    await this.loadAccountByTokenRepository.loadByToken(token, role)
    return new Promise(resolve => resolve(null))
  }
}
