import { LoadSurvey, Controller, HttpRequest, HttpResponse } from './load-surveys.controller-protocols'
import { noContent, ok, serverError } from '../../../helpers/http/http-helper'

export class LoadSurveysController implements Controller {
  constructor (private readonly loadSurvey: LoadSurvey) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurvey.load()
      return surveys.length ? ok(surveys) : noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
