import {
  HttpRequest,
  HttpResponse,
  Controller,
  AddAccount,
  Validation
} from './signup-controller-protocols'

import { badRequest, serverError, ok, forbidden } from '../../../helpers/http/http-helper'
import { Authenticate } from '../login/login-controller-protocols'
import { EmailAlreadyInUse } from '../../../erros'

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authenticate: Authenticate

  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }

      const { name, email, password } = httpRequest.body

      const account = await this.addAccount.add({
        name,
        email,
        password
      })

      if (!account) {
        return forbidden(new EmailAlreadyInUse())
      }

      const accessToken = await this.authenticate.auth({ email, password })

      return ok({ accessToken, name })
    } catch (error) {
      return serverError(error)
    }
  }
}
