import { DbLoadSurveyById } from '../../../../data/usecases/load-survey-by-id/db-load-survey-by-id'
import { SurveyMongoRepository } from '../../../../infra/db/mongodb/survey/survey-repository'

export const makeDbLoadSurveyById = (): DbLoadSurveyById => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbLoadSurveyById(surveyMongoRepository)
}
