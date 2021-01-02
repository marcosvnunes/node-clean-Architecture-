import { AccountModel } from '../../../domain/models/account'
import { LoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository'
import { DbAuthenticate } from './db-authenticate'

describe('DB authenticate Usecase', () => {
  test('should call loadAccountByEmailRepository with correct email', async () => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
      async load (email: string): Promise<AccountModel> {
        const account: AccountModel = {
          id: 'any_id',
          email: 'any_email@mail.com',
          password: 'any_password',
          name: 'any_name'
        }
        return new Promise(resolve => resolve(account))
      }
    }
    const loadAccountByEmailRepositoryStub = new LoadAccountByEmailRepositoryStub()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    const sut = new DbAuthenticate(loadAccountByEmailRepositoryStub)
    await sut.auth({ email: 'any_email@mail.com', password: 'any_password' })
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
})
