import { AccessDeniedError } from '../../erros'
import { AuthMiddleware } from './auth-middleware'
import { forbidden } from '../../helpers/http/http-helper'
const makeSut = (): any => {
  const sut = new AuthMiddleware()
  return {
    sut
  }
}

describe('Auth middleware', () => {
  test('should return 403 if x-access-token no exists in headers', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
})
