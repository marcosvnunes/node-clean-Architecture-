
import { DbLoadAccountByToken } from './db-load-account-by-token'
import { LoadAccountByTokenRepository, AccountModel } from './db-load-account-by-token-protocols'

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  email: 'valid_email',
  password: 'valid_password',
  name: 'valid_name'
})

const makeLoadAccountByTokenRepositorystub = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositorystub implements LoadAccountByTokenRepository {
    async loadByToken (token: string, role?: string): Promise<AccountModel> {
      return new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new LoadAccountByTokenRepositorystub()
}

interface SutTypes {
  sut: DbLoadAccountByToken
  loadAccountByTokenRepositorystub: LoadAccountByTokenRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByTokenRepositorystub = makeLoadAccountByTokenRepositorystub()
  const sut = new DbLoadAccountByToken(loadAccountByTokenRepositorystub)
  return {
    sut,
    loadAccountByTokenRepositorystub
  }
}

describe('DbLoadAccountByToken Usecase', () => {
  test('should call LoadAccountByTokenRepository with correct token', async () => {
    const { sut, loadAccountByTokenRepositorystub } = makeSut()
    const loadByTokenSpy = jest.spyOn(loadAccountByTokenRepositorystub, 'loadByToken')
    await sut.load('any_token', 'any_role')
    expect(loadByTokenSpy).toHaveBeenCalledWith('any_token', 'any_role')
  })

  test('should throw if LoadAccountByTokenRepository throws', async () => {
    const { sut, loadAccountByTokenRepositorystub } = makeSut()
    jest.spyOn(loadAccountByTokenRepositorystub, 'loadByToken')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.load('any_token', 'any_role')
    await expect(promise).rejects.toThrow()
  })
})
