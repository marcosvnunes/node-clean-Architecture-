import { Collection } from 'mongodb'
import { SurveyModel } from '../../../../domain/models/survey'
import { LoadSurveyById } from '../../../../domain/usercases/load-survey-by-id'
import { MongoHelper } from '../../../../infra/db/mongodb/helpers/mongo-helper'
import { HttpRequest } from '../../../protocols'
import { SurveyResultController } from './save-survey-result'
import { forbidden, serverError } from '../../../helpers/http/http-helper'
import { InvalidParamError } from '../../../erros'
import { SaveSurveyResult, SaveSurveyResultModel } from '../../../../domain/usercases/save-survey-result'
import { SurveyResultModel } from '../../../../domain/models/survey-result'
import mockdate from 'mockdate'
let surveyCollection: Collection

const makeFakeSurvey = (): any => ({
  question: 'any_question',
  answers: [{
    answer: 'any_answer',
    image: 'any_image'
  }],
  date: new Date()
})

const makeSurveyData = (): SurveyModel => (
  Object.assign({}, makeFakeSurvey(), { id: 'any_id' })
)
const makeFakeSurveyResult = (): SaveSurveyResultModel => ({
  surveyId: 'any_survey_id',
  accountId: 'any_account_id',
  answer: 'any_answer',
  date: new Date()
})

const makeSurveyResultData = (): SurveyResultModel => (
  Object.assign({}, makeFakeSurveyResult(), { id: 'any_id' })
)

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_survey_id'
  },
  body: {
    answer: 'any_answer'
  },
  accountId: 'any_account_id'
})

const makeLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (id: string): Promise<SurveyModel> {
      return new Promise(resolve => resolve(makeSurveyData()))
    }
  }

  return new LoadSurveyByIdStub()
}

const makeSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
      return new Promise(resolve => resolve(makeSurveyResultData()))
    }
  }

  return new SaveSurveyResultStub()
}
type SutTypes = {
  sut: SurveyResultController
  loadSurveyByIdStub: LoadSurveyById
  saveSurveyResultStub: SaveSurveyResult
}
const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = makeLoadSurveyById()
  const saveSurveyResultStub = makeSaveSurveyResult()

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
      jest.spyOn(loadSurveyByIdStub, 'loadById').mockImplementationOnce(() => { throw new Error() })
      const httpResponse = await sut.handle(makeFakeRequest())
      expect(httpResponse).toEqual(serverError(new Error()))
    })

    test('should call SaveSurveyResult with correct value', async () => {
      const { sut, saveSurveyResultStub } = makeSut()
      const saveSpy = jest.spyOn(saveSurveyResultStub, 'save')
      await sut.handle(makeFakeRequest())
      expect(saveSpy).toHaveBeenCalledWith(makeFakeSurveyResult())
    })
  })
})
