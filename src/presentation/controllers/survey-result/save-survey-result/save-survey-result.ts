import { LoadSurveyById } from '../../../../domain/usercases/load-survey-by-id'
import { InvalidParamError } from '../../../erros'
import { forbidden } from '../../../helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse } from './save-survey-result-protocols'

export class SurveyResultController implements Controller {
  constructor (private readonly loadSurveyById: LoadSurveyById) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const surveyId = httpRequest.params.surveyId
    const survey = await this.loadSurveyById.loadById(surveyId)
    if (!survey) {
      return forbidden(new InvalidParamError('surveyId'))
    }
    return null
  }
}
