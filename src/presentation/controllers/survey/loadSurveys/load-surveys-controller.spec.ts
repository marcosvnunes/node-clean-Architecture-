import { SurveyModel, LoadSurvey } from './load-surveys.controller-protocols'
import { LoadSurveysController } from './load-surveys.controller'
import mockdate from 'mockdate'
import { noContent, ok, serverError } from '../../../helpers/http/http-helper'

const makeFakeSurveys = (): SurveyModel => ({
  id: 'any_id',
  question: 'any_question',
  answers: [{
    answer: 'any_answer',
    image: 'any_image'
  }],
  date: new Date('2022/1/1')
})

const makeLoadSurveySutb = (): LoadSurvey => {
  class LoadSurveysStub implements LoadSurvey {
    async load (): Promise<SurveyModel[]> {
      return new Promise(resolve => resolve([makeFakeSurveys()]))
    }
  }
  return new LoadSurveysStub()
}

interface SutTypes {
  sut: LoadSurveysController
  loadSurveysStub: LoadSurvey
}

const makeSut = (): SutTypes => {
  const loadSurveysStub = makeLoadSurveySutb()
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
    expect(surveys).toEqual(ok([makeFakeSurveys()]))
  })

  test('should return 204 if LoadSurvey return empty', async () => {
    const { sut, loadSurveysStub } = makeSut()
    jest.spyOn(loadSurveysStub, 'load').mockReturnValueOnce(new Promise(resolve => resolve([])))
    const surveys = await sut.handle({})
    expect(surveys).toEqual(noContent())
  })

  test('should return 500 if LoadSurvey throws', async () => {
    const { sut, loadSurveysStub } = makeSut()
    jest.spyOn(loadSurveysStub, 'load').mockImplementationOnce(() => { throw new Error() })
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
