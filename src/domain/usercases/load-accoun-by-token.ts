import { AccountModel } from '../models/account'

export interface LoadAccountByToken {
  load(token: string): Promise<AccountModel>
}
