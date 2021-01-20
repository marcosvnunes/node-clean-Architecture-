import { DbSaveSurveyResult } from './db-save-survey-result'
import { SaveSurveyResultRepository, SurveyResultModel, SaveSurveyResultModel } from './db-save-survey-retult-protocols'
import mockdate from 'mockdate'

const makeFakeurveyResult = (): SaveSurveyResultModel => ({
  accountId: 'any_account_id',
  surveyId: 'any_survey_id',
  answer: 'any_answer',
  date: new Date()
})

const makeSurveyResultData = (): SurveyResultModel => (
  Object.assign({}, makeFakeurveyResult(), { id: 'any_id' })
)

const makeAddSurveyStub = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save (SurveyData: SaveSurveyResultModel): Promise<SurveyResultModel> {
      return new Promise(resolve => resolve(makeSurveyResultData()))
    }
  }
  return new SaveSurveyResultRepositoryStub()
}

interface SutTypes {
  sut: DbSaveSurveyResult
  addSurveyRepositoryStub: SaveSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const addSurveyRepositoryStub = makeAddSurveyStub()
  const sut = new DbSaveSurveyResult(addSurveyRepositoryStub)
  return {
    sut,
    addSurveyRepositoryStub
  }
}

describe('DbAddSurvey UseCase', () => {
  beforeAll(() => {
    mockdate.set('2022/1/1')
  })
  afterAll(() => {
    mockdate.reset()
  })
  test('should call saveSurveyResultRepository with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    const saveSpy = jest.spyOn(addSurveyRepositoryStub, 'save')
    await sut.save(makeFakeurveyResult())
    expect(saveSpy).toHaveBeenCalledWith(makeFakeurveyResult())
  })
})
