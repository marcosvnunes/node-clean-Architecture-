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
  saveSurveyResultRepository: SaveSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepository = makeAddSurveyStub()
  const sut = new DbSaveSurveyResult(saveSurveyResultRepository)
  return {
    sut,
    saveSurveyResultRepository
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
    const { sut, saveSurveyResultRepository } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultRepository, 'save')
    await sut.save(makeFakeurveyResult())
    expect(saveSpy).toHaveBeenCalledWith(makeFakeurveyResult())
  })

  test('should return a surveyResult on success', async () => {
    const { sut } = makeSut()
    const surveys = await sut.save(makeFakeurveyResult())
    expect(surveys).toEqual(makeSurveyResultData())
  })

  test('should throw if saveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepository } = makeSut()
    jest.spyOn(saveSurveyResultRepository, 'save')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.save(makeFakeurveyResult())
    await expect(promise).rejects.toThrow()
  })
})
