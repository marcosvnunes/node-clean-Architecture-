import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogErrorControllerDecorator } from './log'

describe('LogErrorController Decorator', () => {
  test('sholl call controller handle with httpRequest ', async () => {
    class ControllerStub implements Controller {
      async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        const httpResponse: HttpResponse = {
          statusCode: 200,
          body: {
            name: 'Marcos'
          }
        }
        return new Promise(resolve => resolve(httpResponse))
      }
    }
    const controllerstub = new ControllerStub()
    const sut = new LogErrorControllerDecorator(controllerstub)
    const spyHandle = jest.spyOn(controllerstub, 'handle')

    const httpRequest: HttpRequest = {
      body: { name: 'rodrigo' }
    }
    await sut.handle(httpRequest)
    expect(spyHandle).toHaveBeenCalledWith(httpRequest)
  })
})
