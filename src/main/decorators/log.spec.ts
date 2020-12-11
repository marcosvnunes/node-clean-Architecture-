import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogErrorControllerDecorator } from './log'

describe('LogErrorController Decorator', () => {
  const makeControllerStub = (): Controller => {
    class ControllerStub implements Controller {
      async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        const httpResponse: HttpResponse = {
          statusCode: 200,
          body: 'any_body'
        }
        return new Promise(resolve => resolve(httpResponse))
      }
    }
    return new ControllerStub()
  }

  interface SutTypes {
    sut: LogErrorControllerDecorator
    controllerStub: Controller
  }

  const makesut = (): SutTypes => {
    const controllerStub = makeControllerStub()
    const sut = new LogErrorControllerDecorator(controllerStub)
    return {
      sut,
      controllerStub
    }
  }

  test('sholl call controller handle with httpRequest ', async () => {
    const { sut, controllerStub } = makesut()
    const spyHandle = jest.spyOn(controllerStub, 'handle')

    const httpRequest: HttpRequest = {
      body: 'any_body'
    }
    await sut.handle(httpRequest)
    expect(spyHandle).toHaveBeenCalledWith(httpRequest)
  })

  test('should return the same response of the controller', async () => {
    const { sut } = makesut()

    const httpRequest: HttpRequest = {
      body: 'any_body'
    }
    const response = await sut.handle(httpRequest)
    expect(response).toEqual({
      statusCode: 200,
      body: 'any_body'
    })
  })
})
