import { DbSaveSurveyResult } from './db-save-survey-result'
import { SaveSurveyResultRepository } from './db-save-survey-retult-protocols'
import mockdate from 'mockdate'
import { throwError, mockSurveyResultParams, mockSurveyResultModel } from '../../../domain/Fakes'
import { mockSaveSurveyResultRepository } from '../../../data/mock'

interface SutTypes {
  sut: DbSaveSurveyResult
  saveSurveyResultRepository: SaveSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepository = mockSaveSurveyResultRepository()
  const sut = new DbSaveSurveyResult(saveSurveyResultRepository)
  return {
    sut,
    saveSurveyResultRepository
  }
}

describe('DbAddSurvey UseCase', () => {
  beforeAll(() => {
    mockdate.set(new Date())
  })
  afterAll(() => {
    mockdate.reset()
  })
  test('should call saveSurveyResultRepository with correct values', async () => {
    const { sut, saveSurveyResultRepository } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultRepository, 'save')
    await sut.save(mockSurveyResultParams())
    expect(saveSpy).toHaveBeenCalledWith(mockSurveyResultParams())
  })

  test('should return a surveyResult on success', async () => {
    const { sut } = makeSut()
    const surveys = await sut.save(mockSurveyResultParams())
    expect(surveys).toEqual(mockSurveyResultModel())
  })

  test('should throw if saveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepository } = makeSut()
    jest.spyOn(saveSurveyResultRepository, 'save')
      .mockImplementationOnce(throwError)
    const promise = sut.save(mockSurveyResultParams())
    await expect(promise).rejects.toThrow()
  })
})
