import { AccountModel } from '../models/account'

export interface LoadAccountByToken {
  load(token: string, role?: string): Promise<AccountModel>
}
