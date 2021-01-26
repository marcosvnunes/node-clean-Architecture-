import { DbSaveSurveyResult } from '../../../../data/usecases/save-survey-result/db-save-survey-result'
import { SurveyResultMongoRepository } from '../../../../infra/db/mongodb/survey-result/survey-result-repository'

export const makeDbSaveSurveyResult = (): DbSaveSurveyResult => {
  const surveyResultMongoRepository = new SurveyResultMongoRepository()
  return new DbSaveSurveyResult(surveyResultMongoRepository)
}
