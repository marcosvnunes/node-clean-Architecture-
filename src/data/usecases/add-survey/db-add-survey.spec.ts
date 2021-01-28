import { DbAddSurvey } from './db-add-survey'
import { AddSurveyRepository } from './db-add-survey-protocols'
import { throwError, mockSurveyParams } from '../../../domain/Fakes'
import { mockAddSurveyRepository } from '../../mock'
import mockdate from 'mockdate'

interface SutTypes {
  sut: DbAddSurvey
  addSurveyRepositoryStub: AddSurveyRepository
}

const makeSut = (): SutTypes => {
  const addSurveyRepositoryStub = mockAddSurveyRepository()
  const sut = new DbAddSurvey(addSurveyRepositoryStub)
  return {
    sut,
    addSurveyRepositoryStub
  }
}

describe('DbAddSurvey UseCase', () => {
  beforeAll(() => {
    mockdate.set(new Date())
  })
  afterAll(() => {
    mockdate.reset()
  })
  test('should call addSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')
    await sut.add(mockSurveyParams())
    expect(addSpy).toHaveBeenCalledWith(mockSurveyParams())
  })

  test('should throw if addSurveyRepository throws', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    jest.spyOn(addSurveyRepositoryStub, 'add')
      .mockImplementationOnce(throwError)
    const promise = sut.add(mockSurveyParams())
    await expect(promise).rejects.toThrow()
  })
})
