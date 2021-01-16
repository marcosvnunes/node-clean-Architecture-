import { LoadSurvey } from '../../../../domain/usercases/load-surveys'
import { serverError } from '../../../helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../../protocols'

export class LoadSurveysController implements Controller {
  constructor (private readonly loadSurvey: LoadSurvey) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      await this.loadSurvey.load()
      return new Promise(resolve => resolve(null))
    } catch (error) {
      return serverError(error)
    }
  }
}
