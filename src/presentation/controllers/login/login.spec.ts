import { HttpRequest, Authenticate, Validation } from './login-protocols'
import { LoginController } from './login'
import { MissingParamError } from '../../erros/'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http/http-helper'
import { AuthenticateModel } from '../../../domain/usercases/authenticate'

const makeAuthenticate = (): Authenticate => {
  class AuthenticateStub implements Authenticate {
    async auth (authenticate: AuthenticateModel): Promise<string> {
      return new Promise(resolve => resolve('any_token'))
    }
  }
  return new AuthenticateStub()
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

const makeFakeHttpRequest = (): HttpRequest => {
  return {
    body: {
      email: 'any_email@mail.com',
      password: 'any_password'
    }
  }
}

const makeSut = (): any => {
  const authenticateStub = makeAuthenticate()
  const validationStub = makeValidation()
  const sut = new LoginController(authenticateStub, validationStub)
  return {
    sut,
    authenticateStub,
    validationStub
  }
}

describe('Login Controller', () => {
  test('should call authenticate with correct values', async () => {
    const { sut, authenticateStub } = makeSut()
    const httpRequest = makeFakeHttpRequest()
    const authSpy = jest.spyOn(authenticateStub, 'auth')
    await sut.handle(httpRequest)
    expect(authSpy).toHaveBeenCalledWith({
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })

  test('should return 401 if invalid credencials are provided', async () => {
    const { sut, authenticateStub } = makeSut()
    const httpRequest = makeFakeHttpRequest()
    jest.spyOn(authenticateStub, 'auth').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(unauthorized())
  })

  test('should return 500 if Authenticate throws', async () => {
    const { sut, authenticateStub } = makeSut()
    const httpRequest = makeFakeHttpRequest()
    jest.spyOn(authenticateStub, 'auth').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
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
