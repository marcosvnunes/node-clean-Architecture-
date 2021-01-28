import {
  HttpRequest,
  SaveSurveyResult,
  LoadSurveyById
} from './save-survey-result-protocols'
import { SurveyResultController } from './save-survey-result'
import { forbidden, ok, serverError } from '../../../helpers/http/http-helper'
import { InvalidParamError } from '../../../erros'
import { MongoHelper } from '../../../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import mockdate from 'mockdate'
import { mockSurveyResultModel, mockSurveyResultParams, throwError } from '../../../../domain/Fakes'
import { mockLoadSurveyById, mockSaveSurveyResult } from '../../../mock'

let surveyCollection: Collection

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_survey_id'
  },
  body: {
    answer: 'any_answer'
  },
  accountId: 'any_account_id'
})

type SutTypes = {
  sut: SurveyResultController
  loadSurveyByIdStub: LoadSurveyById
  saveSurveyResultStub: SaveSurveyResult
}
const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = mockLoadSurveyById()
  const saveSurveyResultStub = mockSaveSurveyResult()

  const sut = new SurveyResultController(loadSurveyByIdStub, saveSurveyResultStub)
  return {
    sut,
    loadSurveyByIdStub,
    saveSurveyResultStub
  }
}

describe('Survey Mongo Repository', () => {
  beforeAll(async () => {
    mockdate.set(new Date())
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveyResults')
    await surveyCollection.deleteMany({})
  })

  afterAll(async () => {
    mockdate.reset()
    await MongoHelper.disconnect()
  })

  describe('SurveyResult Controller', () => {
    test('should call loadSurveyById with correct value', async () => {
      const { sut, loadSurveyByIdStub } = makeSut()
      const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
      await sut.handle(makeFakeRequest())
      expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id')
    })

    test('should return 403 if loadSurveyById fails', async () => {
      const { sut, loadSurveyByIdStub } = makeSut()
      jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(new Promise(resolve => resolve(null)))
      const survey = await sut.handle(makeFakeRequest())
      expect(survey).toEqual(forbidden(new InvalidParamError('surveyId')))
    })

    test('should return 403 if invalid answer is provided.', async () => {
      const { sut } = makeSut()
      const httpResponse = await sut.handle({
        params: {
          surveyId: 'survey_id'
        },
        body: {
          answer: 'any_wrong'
        }
      })
      expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')))
    })

    test('should return 500 if loadSurveyById throws', async () => {
      const { sut, loadSurveyByIdStub } = makeSut()
      jest.spyOn(loadSurveyByIdStub, 'loadById').mockImplementationOnce(throwError)
      const httpResponse = await sut.handle(makeFakeRequest())
      expect(httpResponse).toEqual(serverError(new Error()))
    })

    test('should call SaveSurveyResult with correct value', async () => {
      const { sut, saveSurveyResultStub } = makeSut()
      const saveSpy = jest.spyOn(saveSurveyResultStub, 'save')
      await sut.handle(makeFakeRequest())
      expect(saveSpy).toHaveBeenCalledWith(mockSurveyResultParams())
    })

    test('should return 500 if loadSurveyById throws', async () => {
      const { sut, saveSurveyResultStub } = makeSut()
      jest.spyOn(saveSurveyResultStub, 'save').mockImplementationOnce(throwError)
      const httpResponse = await sut.handle(makeFakeRequest())
      expect(httpResponse).toEqual(serverError(new Error()))
    })

    test('should return 200 on success', async () => {
      const { sut } = makeSut()
      const httpResponse = await sut.handle(makeFakeRequest())
      expect(httpResponse).toEqual(ok(mockSurveyResultModel()))
    })
  })
})
