import { LogErrorRepository } from '../../data/protocols/log-error-repository'
import { serverError } from '../../presentation/helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogErrorControllerDecorator } from './log'

describe('LogErrorController Decorator', () => {
  const makeFakehttpRequest = (): HttpRequest => {
    return {
      body: 'any_body'
    }
  }

  const makeFakehttpResponse = (): HttpResponse => {
    return {
      statusCode: 200,
      body: 'any_body'
    }
  }

  const makeFakeServerError = (): HttpResponse => {
    const fakeError = new Error()
    fakeError.stack = 'any_stack'
    return serverError(fakeError)
  }

  const makeControllerStub = (): Controller => {
    class ControllerStub implements Controller {
      async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        return new Promise(resolve => resolve(makeFakehttpResponse()))
      }
    }
    return new ControllerStub()
  }

  const makeLogErrorRepositoryStub = (): LogErrorRepository => {
    class LogErrorRepositoryStub implements LogErrorRepository {
      async log (stack: string): Promise<void> {
        return new Promise(resolve => resolve())
      }
    }
    return new LogErrorRepositoryStub()
  }

  interface SutTypes {
    sut: LogErrorControllerDecorator
    controllerStub: Controller
    logErrorRepositoryStub: LogErrorRepository
  }

  const makesut = (): SutTypes => {
    const controllerStub = makeControllerStub()
    const logErrorRepositoryStub = makeLogErrorRepositoryStub()
    const sut = new LogErrorControllerDecorator(controllerStub, logErrorRepositoryStub)
    return {
      sut,
      controllerStub,
      logErrorRepositoryStub
    }
  }

  test('sholl call controller handle with httpRequest ', async () => {
    const { sut, controllerStub } = makesut()
    const spyHandle = jest.spyOn(controllerStub, 'handle')
    await sut.handle(makeFakehttpRequest())
    expect(spyHandle).toHaveBeenCalledWith(makeFakehttpRequest())
  })

  test('should return the same response of the controller', async () => {
    const { sut } = makesut()
    const response = await sut.handle(makeFakehttpRequest())
    expect(response).toEqual(makeFakehttpResponse())
  })

  test('should call LogErrorRepository with correct error if the controll returns a server error ', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makesut()
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'log')

    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise(resolve => resolve(makeFakeServerError())))
    await sut.handle(makeFakehttpRequest())
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
