import { Middlewares, HttpRequest, HttpResponse } from './auth-middleware-protocols'
import { forbidden, ok, serverError } from '../../helpers/http/http-helper'
import { AccessDeniedError } from '../../erros'
import { LoadAccountByToken } from '../../../domain/usercases/load-accoun-by-token'

export class AuthMiddleware implements Middlewares {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = httpRequest.headers?.['x-access-token']
      const account = await this.loadAccountByToken.load(accessToken)
      if (!account || !accessToken) {
        return forbidden(new AccessDeniedError())
      }
      return ok({ accountId: account.id })
    } catch (error) {
      return serverError(error)
    }
  }
}
