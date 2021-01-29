import { Authenticate, AuthenticateParams } from '../../domain/usercases/authenticate'

export const mockAuthenticate = (): Authenticate => {
  class AuthenticateStub implements Authenticate {
    async auth (authenticate: AuthenticateParams): Promise<string> {
      return Promise.resolve('any_token')
    }
  }
  return new AuthenticateStub()
}
