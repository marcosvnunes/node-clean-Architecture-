import { HttpRequest } from './signin-controller-protocols'
import { SignInController } from './signin-controller'
import { MissingParamError } from '../../../erros'
import { badRequest, ok, serverError, unauthorized } from '../../../helpers/http/http-helper'
import { mockAuthenticateParams, throwError } from '../../../../domain/Fakes'
import { mockValidation } from '../../../../validation/mock'
import { mockAuthenticate } from '../../../mock'

const makeFakeHttpRequest = (): HttpRequest => {
  return {
    body: mockAuthenticateParams()
  }
}
const makeSut = (): any => {
  const authenticateStub = mockAuthenticate()
  const validationStub = mockValidation()
  const sut = new SignInController(authenticateStub, validationStub)
  return {
    sut,
    authenticateStub,
    validationStub
  }
}

describe('SignIn Controller', () => {
  test('should call authenticate with correct values', async () => {
    const { sut, authenticateStub } = makeSut()
    const httpRequest = makeFakeHttpRequest()
    const authSpy = jest.spyOn(authenticateStub, 'auth')
    await sut.handle(httpRequest)
    expect(authSpy).toHaveBeenCalledWith(mockAuthenticateParams())
  })

  test('should return 401 if invalid credencials are provided', async () => {
    const { sut, authenticateStub } = makeSut()
    const httpRequest = makeFakeHttpRequest()
    jest.spyOn(authenticateStub, 'auth').mockReturnValueOnce(Promise.resolve(null))
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(unauthorized())
  })

  test('should return 500 if Authenticate throws', async () => {
    const { sut, authenticateStub } = makeSut()
    const httpRequest = makeFakeHttpRequest()
    jest.spyOn(authenticateStub, 'auth').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should return 200 if valid credencials are provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
  })

  test('should call validation with correct value', async () => {
    const { sut, validationStub } = makeSut()
    const httpRequest = makeFakeHttpRequest()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('should return 400 if validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    const httpRequest = makeFakeHttpRequest()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_param'))
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_param')))
  })
})
