import { AddSurvey } from '../../../../domain/usercases/add-survey'
import { badRequest, serverError } from '../../../helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../../protocols'
import { Validation } from '../../../protocols/validation'

export class SurveyController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey

  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      const { question, answers } = httpRequest.body
      await this.addSurvey.add({ question, answers })
      return badRequest(error)
    } catch (error) {
      return serverError(error)
    }
  }
}
