import { LoadSurveyById } from '../../../../domain/usercases/load-survey-by-id'
import { Controller, HttpRequest, HttpResponse } from './save-survey-result-protocols'

export class SurveyResultController implements Controller {
  constructor (private readonly loadSurveyById: LoadSurveyById) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const surveyId = httpRequest.params.surveyId
    await this.loadSurveyById.loadById(surveyId)
    return null
  }
}
