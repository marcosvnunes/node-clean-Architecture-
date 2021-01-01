import { Authenticate } from '../../../domain/usercases/authenticate'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http-helper'
import { Validation } from '../../helpers/validators/validation'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'

export class LoginController implements Controller {
  private readonly authenticate: Authenticate
  private readonly validation: Validation

  constructor (authenticate: Authenticate, validation: Validation) {
    this.authenticate = authenticate
    this.validation = validation
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)

      if (error) {
        return badRequest(error)
      }
      const { email, password } = httpRequest.body
      const accessToken = await this.authenticate.auth(email, password)

      if (!accessToken) {
        return unauthorized()
      }
      return ok({ accessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}
