import { AccountModel } from '../models/account'
import { AddAccountParams } from '../usercases/add-account'

export const mockAddAccountParams = (): AddAccountParams => {
  return {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password'
  }
}

export const mockAccountModel = (): AccountModel => ({
  id: 'any_id',
  email: 'any_email@mail.com',
  password: 'any_password',
  name: 'any_name'
})

export const mockAccountModelDB = (): AccountModel => {
  const fakeAccountDB = Object.assign(
    {},
    mockAccountModel(),
    { password: 'hashed_password' }
  )
  return fakeAccountDB
}
