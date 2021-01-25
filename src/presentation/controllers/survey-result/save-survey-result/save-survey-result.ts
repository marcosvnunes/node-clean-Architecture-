import { LoadSurveyById } from '../../../../domain/usercases/load-survey-by-id'
import { InvalidParamError } from '../../../erros'
import { forbidden, serverError } from '../../../helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse } from './save-survey-result-protocols'

export class SurveyResultController implements Controller {
  constructor (private readonly loadSurveyById: LoadSurveyById) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params
      const { answer } = httpRequest.body

      const survey = await this.loadSurveyById.loadById(surveyId)
      if (survey) {
        const answers = survey.answers.map(s => s.answer)
        if (!answers.includes(answer)) {
          return forbidden(new InvalidParamError('answer'))
        }
      } else {
        return forbidden(new InvalidParamError('surveyId'))
      }
      return null
    } catch (error) {
      return serverError(error)
    }
  }
}
