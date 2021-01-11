import { SignInController } from '../../../../presentation/controllers/login/signin/signin-controller'
import { LogErrorControllerDecorator } from '../../../decorators/log'
import { Controller } from '../../../../presentation/protocols'
import { LogMongoRepository } from '../../../../infra/db/mongodb/log/log-repository'
import { makeValidationComposite } from '../signin/signin-validation-factory'
import { makeAuthenticate } from '../../usercases/authenticate/authenticate-factory'

export const makeLoginController = (): Controller => {
  const loginController = new SignInController(makeAuthenticate(), makeValidationComposite())
  const logMongoRepository = new LogMongoRepository()
  return new LogErrorControllerDecorator(loginController, logMongoRepository)
}
