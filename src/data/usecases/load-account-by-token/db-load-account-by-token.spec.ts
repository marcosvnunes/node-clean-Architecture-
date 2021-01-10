
import { DbLoadAccountByToken } from './db-load-account-by-token'
import { LoadAccountByTokenRepository, AccountModel } from './db-load-account-by-token-protocols'

describe('DbLoadAccountByToken Usecase', () => {
  test('should call LoadAccountByTokenRepository with correct token', async () => {
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
    const loadAccountByTokenRepositorystub = new LoadAccountByTokenRepositorystub()
    const loadByTokenSpy = jest.spyOn(loadAccountByTokenRepositorystub, 'loadByToken')
    const sut = new DbLoadAccountByToken(loadAccountByTokenRepositorystub)
    await sut.load('any_token', 'any_role')
    expect(loadByTokenSpy).toHaveBeenCalledWith('any_token', 'any_role')
  })
})
