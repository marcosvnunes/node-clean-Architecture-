import { LoginController } from './login'
import { InvalidParamError, MissingParamError } from '../../erros/'
import { badRequest, serverError } from '../../helpers/http-helper'
import { EmailValidator, HttpRequest } from '../signup/signup-protocols'
import { Authenticate } from '../../../domain/usercases/authenticate'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeAuthenticate = (): Authenticate => {
  class AuthenticateStub implements Authenticate {
    async auth (email: string, password: string): Promise<string> {
      return new Promise(resolve => resolve('any_token'))
    }
  }
  return new AuthenticateStub()
}

const makeFakeHttpRequest = (): HttpRequest => {
  return {
    body: {
      email: 'any_email@mail.com',
      password: 'any_password'
    }
  }
}

const makeFakeHttpRequestMissingProp = (prop: string): HttpRequest => {
  const httpRequest = makeFakeHttpRequest()
  delete httpRequest.body[prop]
  return httpRequest
}

const makeSut = (): any => {
  const emailValidatorStub = makeEmailValidator()
  const authenticateStub = makeAuthenticate()
  const sut = new LoginController(emailValidatorStub, authenticateStub)
  return {
    sut,
    emailValidatorStub,
    authenticateStub
  }
}

describe('Login Controller', () => {
  test('should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeHttpRequestMissingProp('email')
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeHttpRequestMissingProp('password')
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  test('should return 400 if invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const httpRequest = makeFakeHttpRequest()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  test('should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const httpRequest = makeFakeHttpRequest()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('should return 500 if Emailvalidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const httpRequest = makeFakeHttpRequest()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should call authenticate with correct values', async () => {
    const { sut, authenticateStub } = makeSut()
    const httpRequest = makeFakeHttpRequest()
    const authSpy = jest.spyOn(authenticateStub, 'auth')
    await sut.handle(httpRequest)
    expect(authSpy).toHaveBeenCalledWith('any_email@mail.com', 'any_password')
  })
})
