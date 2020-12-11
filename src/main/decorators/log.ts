import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'

export class LogErrorControllerDecorator implements Controller {
  private readonly controller: Controller
  constructor (controller: Controller) {
    this.controller = controller
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest)

    return httpResponse
  }
}
