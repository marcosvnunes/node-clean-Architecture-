import { Collection } from 'mongodb'
import { SurveyModel } from '../../../../domain/models/survey'
import { LoadSurveyById } from '../../../../domain/usercases/load-survey-by-id'
import { MongoHelper } from '../../../../infra/db/mongodb/helpers/mongo-helper'
import { HttpRequest } from '../../../protocols'
import { SurveyResultController } from './save-survey-result'
import { forbidden } from '../../../helpers/http/http-helper'
import { InvalidParamError } from '../../../erros'
let surveyCollection: Collection

const makeSurveyData = (): SurveyModel => (
  Object.assign({}, makeFakeSurvey(), { id: 'any_id' })
)

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'survey_id'
  }
})

const makeLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (id: string): Promise<SurveyModel> {
      return new Promise(resolve => resolve(makeSurveyData()))
    }
  }

  return new LoadSurveyByIdStub()
}
type SutTypes = {
  sut: SurveyResultController
  loadSurveyByIdStub: LoadSurveyById
}
const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = makeLoadSurveyById()
  const sut = new SurveyResultController(loadSurveyByIdStub)
  return {
    sut,
    loadSurveyByIdStub
  }
}

const makeFakeSurvey = (): any => ({
  question: 'any_question',
  answers: [{
    answer: 'any_answer',
    image: 'any_image'
  }],
  date: new Date()
})

describe('Survey Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveyResults')
    await surveyCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  describe('SurveyResult Controller', () => {
    test('should call loadSurveyById with correct value', async () => {
      const { sut, loadSurveyByIdStub } = makeSut()
      const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
      await sut.handle(makeFakeRequest())
      expect(loadByIdSpy).toHaveBeenCalledWith('survey_id')
    })

    test('should return 403 if loadSurveyById fails', async () => {
      const { sut, loadSurveyByIdStub } = makeSut()
      jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(new Promise(resolve => resolve(null)))
      const survey = await sut.handle(makeFakeRequest())
      expect(survey).toEqual(forbidden(new InvalidParamError('surveyId')))
    })
  })
})
