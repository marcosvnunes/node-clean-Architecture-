import { Middlewares, HttpRequest, HttpResponse } from './auth-middleware-protocols'
import { forbidden } from '../../helpers/http/http-helper'
import { AccessDeniedError } from '../../erros'

export class AuthMiddleware implements Middlewares {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    return new Promise(resolve => resolve(forbidden(new AccessDeniedError())))
  }
}
