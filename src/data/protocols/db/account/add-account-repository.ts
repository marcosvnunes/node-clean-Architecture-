import { AccountModel } from '../../../../domain/models/account'
import { AddAccountParams } from '../../../../domain/usercases/add-account'

export interface AddAccountRepository {
  add(accountData: AddAccountParams): Promise<AccountModel>
}
