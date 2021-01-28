import { Authenticate, AuthenticateParams } from '../../domain/usercases/authenticate'

export const mockAuthenticate = (): Authenticate => {
  class AuthenticateStub implements Authenticate {
    async auth (authenticate: AuthenticateParams): Promise<string> {
      return new Promise(resolve => resolve('any_token'))
    }
  }
  return new AuthenticateStub()
}
