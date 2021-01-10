import { Middlewares, HttpRequest, HttpResponse } from './auth-middleware-protocols'
import { forbidden, ok, serverError } from '../../helpers/http/http-helper'
import { AccessDeniedError } from '../../erros'
import { LoadAccountByToken } from '../../../domain/usercases/load-accoun-by-token'

export class AuthMiddleware implements Middlewares {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string

  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = httpRequest.headers?.['x-access-token']
      if (accessToken) {
        const account = await this.loadAccountByToken.load(accessToken, this.role)
        if (account) {
          return ok({ accountId: account.id })
        }
      }
      return forbidden(new AccessDeniedError())
    } catch (error) {
      return serverError(error)
    }
  }
}
