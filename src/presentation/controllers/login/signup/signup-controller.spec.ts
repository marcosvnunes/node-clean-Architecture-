import { SignUpController } from './signup-controller'
import { EmailAlreadyInUse, MissingParamError } from '../../../erros'
import { AddAccount, Validation } from './signup-controller-protocols'
import { badRequest, serverError, ok, forbidden } from '../../../helpers/http/http-helper'
import { Authenticate } from '../../../../domain/usercases/authenticate'
import { mockAddAccountParams, mockAuthenticateParams, throwError } from '../../../../domain/Fakes'
import { mockAddAccountRepository } from '../../../../data/mock'
import { mockHttpRequestSignUp } from './mock'
import { mockValidation } from '../../../../validation/mock'
import { mockAuthenticate } from '../../../mock'

interface SutTypes{
  sut: SignUpController
  addAccountStub: AddAccount
  validationStub: Validation
  authenticateStub: Authenticate
}

const makeSut = (): SutTypes => {
  const addAccountStub = mockAddAccountRepository()
  const validationStub = mockValidation()
  const authenticateStub = mockAuthenticate()

  const sut = new SignUpController(addAccountStub, validationStub, authenticateStub)
  return {
    sut,
    addAccountStub,
    validationStub,
    authenticateStub
  }
}

const makeFakeServerError = (): Error => {
  const fakeError = new Error()
  fakeError.stack = 'any_stack'
  return fakeError
}

describe('SingUp Controller', () => {
  test('should call addAccout with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    await sut.handle(mockHttpRequestSignUp())
    expect(addSpy).toHaveBeenCalledWith(mockAddAccountParams())
  })

  test('should return 403 AddAccount returns null', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const httpRequest = mockHttpRequestSignUp()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(forbidden(new EmailAlreadyInUse()))
  })

  test('should return 500 if addAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementation(async () => {
      return new Promise((resolve, reject) => reject(new Error()))
    })
    const httpResponse = await sut.handle(mockHttpRequestSignUp())
    expect(httpResponse).toEqual(serverError(makeFakeServerError()))
  })

  test('should return 200 if valid data are provided', async () => {
    const { sut } = makeSut()
    const httpRequest = mockHttpRequestSignUp()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok({ accessToken: 'any_token', name: 'any_name' }))
  })

  test('should call validation with correct value', async () => {
    const { sut, validationStub } = makeSut()
    const httpRequest = mockHttpRequestSignUp()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('should return 400 if validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    const httpRequest = mockHttpRequestSignUp()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_param'))
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_param')))
  })

  test('should call authenticate with correct values', async () => {
    const { sut, authenticateStub } = makeSut()
    const httpRequest = mockHttpRequestSignUp()
    const authSpy = jest.spyOn(authenticateStub, 'auth')
    await sut.handle(httpRequest)
    expect(authSpy).toHaveBeenCalledWith(mockAuthenticateParams())
  })

  test('should return 500 if Authenticate throws', async () => {
    const { sut, authenticateStub } = makeSut()
    const httpRequest = mockHttpRequestSignUp()
    jest.spyOn(authenticateStub, 'auth').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
