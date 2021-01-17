import { LogMongoRepository } from '../../../../infra/db/mongodb/log/log-repository'
import { LoadSurveysController } from '../../../../presentation/controllers/survey/loadSurveys/load-surveys.controller'
import { LogErrorControllerDecorator } from '../../../decorators/log'
import { Controller } from '../../../../presentation/protocols'
import { makeDbLoadAccountByToken } from '../../usercases/loadSurveys/db-load-surveys-factory'

export const makeLoadSurveyController = (): Controller => {
  const logMongoRepository = new LogMongoRepository()
  const loadSurveysController = new LoadSurveysController(makeDbLoadAccountByToken())
  return new LogErrorControllerDecorator(loadSurveysController, logMongoRepository)
}
