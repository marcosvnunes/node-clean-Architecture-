
import { DbLoadAccountByToken } from './db-load-account-by-token'
import { LoadAccountByTokenRepository, Decrypter } from './db-load-account-by-token-protocols'
import { throwError, mockAccountModel } from '../../../domain/Fakes'
import { mockDecrypter, mockLoadAccountByTokenRepositorystub } from '../../mock'

interface SutTypes {
  sut: DbLoadAccountByToken
  decrypterStub: Decrypter
  loadAccountByTokenRepositorystub: LoadAccountByTokenRepository
}

const makeSut = (): SutTypes => {
  const decrypterStub = mockDecrypter()
  const loadAccountByTokenRepositorystub = mockLoadAccountByTokenRepositorystub()
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
      .mockImplementationOnce(throwError)
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
      .mockImplementationOnce(throwError)
    const promise = sut.load('any_token', 'any_role')
    await expect(promise).rejects.toThrow()
  })

  test('should return an account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.load('any_token', 'any_role')
    expect(account).toEqual(mockAccountModel())
  })
})
