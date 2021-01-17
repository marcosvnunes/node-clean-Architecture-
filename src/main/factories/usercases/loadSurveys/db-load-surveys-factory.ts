import { SurveyMongoRepository } from '../../../../infra/db/mongodb/survey/survey-repository'
import { DbLoadSurveys } from '../../../../data/usecases/load-surveys/db-load-surveys'

export const makeDbLoadAccountByToken = (): DbLoadSurveys => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbLoadSurveys(surveyMongoRepository)
}
