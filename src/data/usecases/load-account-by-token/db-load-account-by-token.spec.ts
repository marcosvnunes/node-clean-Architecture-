
import { DbLoadAccountByToken } from './db-load-account-by-token'
import { LoadAccountByTokenRepository, AccountModel } from './db-load-account-by-token-protocols'

const makeLoadAccountByTokenRepositorystub = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositorystub implements LoadAccountByTokenRepository {
    async loadByToken (token: string, role?: string): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        email: 'valid_email',
        password: 'valid_password',
        name: 'valid_name'
      }
      return new Promise(resolve => resolve(fakeAccount))
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
})
