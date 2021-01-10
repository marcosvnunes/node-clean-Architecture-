import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-repository'
import { SurveyController } from '../../../presentation/controllers/survey/addSurvey/addsurvey-controller'
import { LogErrorControllerDecorator } from '../../decorators/log'
import { Controller } from '../../../presentation/protocols'
import { makeDbAddSurvey } from '../usercases/addsurvey/DbAddSurvey-factory'
import { makeValidationComposite } from './survey-validation-factory'

export const makeSurveyController = (): Controller => {
  const logMongoRepository = new LogMongoRepository()
  const surveyController = new SurveyController(makeValidationComposite(), makeDbAddSurvey())
  return new LogErrorControllerDecorator(surveyController, logMongoRepository)
}
