import { LogErrorRepository } from '../../data/protocols/log-error-repository'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'

export class LogErrorControllerDecorator implements Controller {
  private readonly controller: Controller
  private readonly logErrrorRepository: LogErrorRepository

  constructor (controller: Controller, logErrrorRepository: LogErrorRepository) {
    this.controller = controller
    this.logErrrorRepository = logErrrorRepository
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest)

    if (httpResponse.statusCode === 500) {
      await this.logErrrorRepository.logError(httpResponse.body.stack)
    }

    return httpResponse
  }
}
