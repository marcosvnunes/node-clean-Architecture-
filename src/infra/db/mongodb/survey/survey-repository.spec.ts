import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-repository'
let surveyCollection: Collection

describe('Survey Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  const makeSut = (): SurveyMongoRepository => {
    return new SurveyMongoRepository()
  }

  const makeFakeSurvey = (): any => ({
    question: 'question',
    answers: [{
      answer: 'answer',
      image: 'any_image'
    }],
    date: new Date()
  })

  test('should create survey on add success', async () => {
    const sut = makeSut()
    await sut.add(makeFakeSurvey())
    const count = await surveyCollection.countDocuments()
    expect(count).toBe(1)
  })
})
