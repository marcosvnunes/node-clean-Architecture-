import { Controller, HttpRequest, HttpResponse, Authenticate, Validation } from './signin-controller-protocols'
import { badRequest, ok, serverError, unauthorized } from '../../../helpers/http/http-helper'

export class SignInController implements Controller {
  constructor (
    private readonly authenticate: Authenticate,
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)

      if (error) {
        return badRequest(error)
      }
      const { email, password } = httpRequest.body
      const accessToken = await this.authenticate.auth({
        email,
        password
      })

      if (!accessToken) {
        return unauthorized()
      }
      return ok({ accessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}
