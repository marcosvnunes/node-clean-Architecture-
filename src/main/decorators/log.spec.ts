import { LogErrorRepository } from '../../data/protocols/db/log/log-error-repository'
import { serverError } from '../../presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogErrorControllerDecorator } from './log'

describe('Log Error Controller Decorator', () => {
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
        return Promise.resolve(makeFakehttpResponse())
      }
    }
    return new ControllerStub()
  }

  const makeLogErrorRepositoryStub = (): LogErrorRepository => {
    class LogErrorRepositoryStub implements LogErrorRepository {
      async logError (stack: string): Promise<void> {
        return Promise.resolve()
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

  test('should call controller handle with httpRequest ', async () => {
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
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')

    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(Promise.resolve(makeFakeServerError()))
    await sut.handle(makeFakehttpRequest())
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
