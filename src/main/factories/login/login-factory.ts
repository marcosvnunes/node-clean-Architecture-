import { LoginController } from '../../../presentation/controllers/login/login-controller'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-repository'
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { LogErrorControllerDecorator } from '../../decorators/log'
import { Controller } from '../../../presentation/protocols'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-repository'
import { makeValidationComposite } from './login-validation-factory'
import { DbAuthenticate } from '../../../data/usecases/authenticate/db-authenticate'
import { JwtAdapter } from '../../../infra/criptography/jwt-adapter/jwt-adapter'
import { env } from '../../config/env'

export const makeLoginController = (): Controller => {
  const salt = 12
  const accountMongoRepository = new AccountMongoRepository()
  const jwtAdapter = new JwtAdapter(env.secretKey)
  const bcryptAdapter = new BcryptAdapter(salt)
  const dbAuthenticate = new DbAuthenticate(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository)
  const loginController = new LoginController(dbAuthenticate, makeValidationComposite())
  const logMongoRepository = new LogMongoRepository()
  return new LogErrorControllerDecorator(loginController, logMongoRepository)
}
