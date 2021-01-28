import { AccountModel } from '../models/account'
import { AddAccountParams } from '../usercases/add-account'
import { AuthenticateParams } from '../usercases/authenticate'

export const mockAddAccountParams = (): AddAccountParams => {
  return {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password'
  }
}

export const mockAccountFullModel = (): any => {
  return {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    accessToken: 'any_token',
    role: 'admin'
  }
}

export const mockAccountWithAccessTokenModel = (): any => {
  return {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    accessToken: 'any_token'
  }
}

export const mockAccountModel = (): AccountModel => (Object.assign({}, mockAddAccountParams(), {
  id: 'any_id'
}))

export const mockAccountModelDB = (): AccountModel => {
  const fakeAccountDB = Object.assign(
    {},
    mockAccountModel(),
    { password: 'hashed_password' }
  )
  return fakeAccountDB
}

export const mockAuthenticateParams = (): AuthenticateParams => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})
