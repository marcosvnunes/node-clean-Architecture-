import { Middlewares, HttpRequest, HttpResponse } from './auth-middleware-protocols'
import { forbidden } from '../../helpers/http/http-helper'
import { AccessDeniedError } from '../../erros'
import { LoadAccountByToken } from '../../../domain/usercases/load-accoun-by-token'

export class AuthMiddleware implements Middlewares {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToekn = httpRequest.headers?.['x-access-token']
    await this.loadAccountByToken.load(accessToekn)
    return new Promise(resolve => resolve(forbidden(new AccessDeniedError())))
  }
}
