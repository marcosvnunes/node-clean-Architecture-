import { Authenticate } from '../../../domain/usercases/authenticate'
import { InvalidParamError, MissingParamError } from '../../erros'
import { badRequest, serverError } from '../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { EmailValidator } from '../signup/signup-protocols'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly authenticate: Authenticate

  constructor (emailValidator: EmailValidator, authenticate: Authenticate) {
    this.emailValidator = emailValidator
    this.authenticate = authenticate
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = httpRequest.body
      if (!email) {
        return new Promise(resolve => resolve(badRequest(new MissingParamError('email'))))
      }
      if (!password) {
        return new Promise(resolve => resolve(badRequest(new MissingParamError('password'))))
      }
      const isValidEmail = this.emailValidator.isValid(email)
      if (!isValidEmail) {
        return new Promise(resolve => resolve(badRequest(new InvalidParamError('email'))))
      }

      await this.authenticate.auth(email, password)
    } catch (error) {
      return serverError(error)
    }
  }
}
