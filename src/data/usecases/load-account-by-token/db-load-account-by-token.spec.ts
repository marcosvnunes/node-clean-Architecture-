
import { DbLoadAccountByToken } from './db-load-account-by-token'
import { LoadAccountByTokenRepository, AccountModel, Decrypter } from './db-load-account-by-token-protocols'

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

const makeDecrypterStub = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (token: string): Promise<string> {
      return new Promise(resolve => resolve('any_value'))
    }
  }
  return new DecrypterStub()
}

interface SutTypes {
  sut: DbLoadAccountByToken
  decrypterStub: Decrypter
  loadAccountByTokenRepositorystub: LoadAccountByTokenRepository
}

const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypterStub()
  const loadAccountByTokenRepositorystub = makeLoadAccountByTokenRepositorystub()
  const sut = new DbLoadAccountByToken(decrypterStub, loadAccountByTokenRepositorystub)
  return {
    sut,
    decrypterStub,
    loadAccountByTokenRepositorystub
  }
}

describe('DbLoadAccountByToken Usecase', () => {
  test('should call Decrypter with correct values', async () => {
    const { sut, decrypterStub } = makeSut()
    const loadByTokenSpy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.load('any_token', 'any_role')
    expect(loadByTokenSpy).toHaveBeenCalledWith('any_token')
  })

  test('should return null if Decrypter fails', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt')
      .mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const account = await sut.load('any_token', 'any_role')
    expect(account).toBeNull()
  })

  test('should throw if Decrypter throws', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.load('any_token', 'any_role')
    await expect(promise).rejects.toThrow()
  })

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

  test('should return an account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.load('any_token', 'any_role')
    expect(account).toEqual(makeFakeAccount())
  })
})
