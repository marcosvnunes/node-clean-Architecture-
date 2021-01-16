import { SurveyModel } from '../../../../domain/models/survey'
import { LoadSurvey } from '../../../../domain/usercases/load-surveys'
import { LoadSurveysController } from './load-surveys.controller'
import mockdate from 'mockdate'

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
})
