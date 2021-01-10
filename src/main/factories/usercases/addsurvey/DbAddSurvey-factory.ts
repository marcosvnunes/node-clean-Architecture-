import { SurveyMongoRepository } from '../../../../infra/db/mongodb/survey/survey-repository'
import { AddSurveyRepository } from '../../../../data/protocols/db/survey/add-survey-repository'
import { DbAddSurvey } from '../../../../data/usecases/add-survey/db-add-survey'

export const makeDbAddSurvey = (): AddSurveyRepository => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbAddSurvey(surveyMongoRepository)
}
