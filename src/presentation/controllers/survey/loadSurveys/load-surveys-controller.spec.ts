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

describe('LoadSurveys Controller', () => {
  beforeAll(() => {
    mockdate.set('2022/1/1')
  })
  afterAll(() => {
    mockdate.reset()
  })
  test('should call LoadSurvey', async () => {
    class LoadSurveysStub implements LoadSurvey {
      async load (): Promise<SurveyModel[]> {
        return new Promise(resolve => resolve([makeFakeSurveys()]))
      }
    }

    const loadSurveysStub = new LoadSurveysStub()
    const spyLoad = jest.spyOn(loadSurveysStub, 'load')
    const sut = new LoadSurveysController(loadSurveysStub)
    await sut.handle({})
    expect(spyLoad).toHaveBeenCalledWith()
  })
})
