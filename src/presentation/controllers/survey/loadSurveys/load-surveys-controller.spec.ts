import { LoadSurvey } from './load-surveys.controller-protocols'
import { LoadSurveysController } from './load-surveys.controller'
import { noContent, ok, serverError } from '../../../helpers/http/http-helper'
import { mockSurveysModel, throwError } from '../../../../domain/Fakes'
import { mockLoadSurvey } from '../../../mock'
import mockdate from 'mockdate'

interface SutTypes {
  sut: LoadSurveysController
  loadSurveysStub: LoadSurvey
}

const makeSut = (): SutTypes => {
  const loadSurveysStub = mockLoadSurvey()
  const sut = new LoadSurveysController(loadSurveysStub)
  return {
    sut,
    loadSurveysStub
  }
}

describe('LoadSurveys Controller', () => {
  beforeAll(() => {
    mockdate.set('2022/1/1')
  })

  afterAll(() => {
    mockdate.reset()
  })

  test('should call LoadSurvey', async () => {
    const { sut, loadSurveysStub } = makeSut()
    const spyLoad = jest.spyOn(loadSurveysStub, 'load')
    await sut.handle({})
    expect(spyLoad).toHaveBeenCalledWith()
  })

  test('should return 200 on success', async () => {
    const { sut } = makeSut()
    const surveys = await sut.handle({})
    expect(surveys).toEqual(ok(mockSurveysModel()))
  })

  test('should return 204 if LoadSurvey return empty', async () => {
    const { sut, loadSurveysStub } = makeSut()
    jest.spyOn(loadSurveysStub, 'load').mockReturnValueOnce(new Promise(resolve => resolve([])))
    const surveys = await sut.handle({})
    expect(surveys).toEqual(noContent())
  })

  test('should return 500 if LoadSurvey throws', async () => {
    const { sut, loadSurveysStub } = makeSut()
    jest.spyOn(loadSurveysStub, 'load').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
