import { SurveyModel } from '../models/survey'
import { SurveyResultModel } from '../models/survey-result'
import { AddSurveyParams } from '../usercases/add-Survey'
import { SaveSurveyResultParams } from '../usercases/save-survey-result'

export const mockSurveyParams = (): AddSurveyParams => ({
  question: 'any_question',
  answers: [{
    answer: 'any_answer',
    image: 'any_image'
  }, {
    answer: 'other_answer',
    image: 'other_image'
  }],
  date: new Date('2021/1/1')
})

export const mockSurveyModel = (): SurveyModel => (Object.assign({}, mockSurveyParams(), {
  id: 'any_id'
}))

export const mockSurveysModel = (): SurveyModel[] => ([{
  id: 'any_id',
  question: 'any_question',
  answers: [{
    answer: 'any_answer',
    image: 'any_image'
  }],
  date: new Date()
},
{
  id: 'other_id',
  question: 'other_question',
  answers: [{
    answer: 'other_answer',
    image: 'other_image'
  }],
  date: new Date()
}])

export const mockSurveyResultParams = (): SaveSurveyResultParams => ({
  accountId: 'any_account_id',
  surveyId: 'any_survey_id',
  answer: 'any_answer',
  date: new Date()
})

export const mockSurveyResultModel = (): SurveyResultModel => (
  Object.assign({}, mockSurveyResultParams(), { id: 'any_id' })
)
