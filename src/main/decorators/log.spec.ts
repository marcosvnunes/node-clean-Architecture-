import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogErrorControllerDecorator } from './log'

describe('LogErrorController Decorator', () => {
  const makeControllerStub = (): Controller => {
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
    return new ControllerStub()
  }

  const makesut = (): any => {
    const controllerstub = makeControllerStub()
    const sut = new LogErrorControllerDecorator(controllerstub)
    return {
      sut,
      controllerstub
    }
  }

  test('sholl call controller handle with httpRequest ', async () => {
    const { sut, controllerstub } = makesut()
    const spyHandle = jest.spyOn(controllerstub, 'handle')

    const httpRequest: HttpRequest = {
      body: { name: 'rodrigo' }
    }
    await sut.handle(httpRequest)
    expect(spyHandle).toHaveBeenCalledWith(httpRequest)
  })
})
