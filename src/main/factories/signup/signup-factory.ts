import { SignUpController } from '../../../presentation/controllers/login/signup/signup-controller'
import { LogErrorControllerDecorator } from '../../decorators/log'
import { Controller } from '../../../presentation/protocols'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-repository'
import { makeValidationComposite } from './signup-validation-factory'
import { makeAuthenticate } from '../usercases/authenticate/authenticate-factory'
import { makeDbAddAccount } from '../usercases/addAccount/DbAddAccount-factory'

export const makeSignUpController = (): Controller => {
  const signUpController = new SignUpController(makeDbAddAccount(), makeValidationComposite(), makeAuthenticate())
  const logMongoRepository = new LogMongoRepository()
  return new LogErrorControllerDecorator(signUpController, logMongoRepository)
}
