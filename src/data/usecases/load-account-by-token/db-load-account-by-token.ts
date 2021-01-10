import { AccountModel } from '../../../domain/models/account'
import { LoadAccountByToken } from '../../../domain/usercases/load-accoun-by-token'
import { LoadAccountByTokenRepository } from '../../protocols/db/account/load-account-by-token-repository'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async load (token: string, role?: string): Promise<AccountModel> {
    await this.loadAccountByTokenRepository.loadByToken(token, role)
    return new Promise(resolve => resolve(null))
  }
}
