import { LogMongoRepository } from '../../../../infra/db/mongodb/log/log-repository'
import { SurveyResultController } from '../../../../presentation/controllers/survey-result/save-survey-result/save-survey-result'
import { LogErrorControllerDecorator } from '../../../decorators/log'
import { Controller } from '../../../../presentation/protocols'
import { makeDbLoadSurveyById } from '../../usercases/loadSurveyById/db-load-survey-by-id-factory'
import { makeDbSaveSurveyResult } from '../../usercases/saveSurveyResult/db-save-survey-result-factory'

export const makeSaveSurveyResultController = (): Controller => {
  const logMongoRepository = new LogMongoRepository()
  const surveyController = new SurveyResultController(makeDbLoadSurveyById(), makeDbSaveSurveyResult())
  return new LogErrorControllerDecorator(surveyController, logMongoRepository)
}
