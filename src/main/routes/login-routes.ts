import { Router } from 'express'
import { adaptRoute } from '../adapters/express/express-routes-adapter'
import { makeSignUpController } from '../factories/signup/signup-factory'
import { makeLoginController } from '../factories/signin/signin-factory'

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()))
  router.post('/signin', adaptRoute(makeLoginController()))
}
