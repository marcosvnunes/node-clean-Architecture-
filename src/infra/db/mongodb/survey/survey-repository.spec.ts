import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-repository'
let surveyCollection: Collection

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('survey')
    await surveyCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  const makeSut = (): SurveyMongoRepository => {
    return new SurveyMongoRepository()
  }

  const makeFakeSurvey = (): any => ({
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password'
  })

  test('should create survey on add success', async () => {
    const sut = makeSut()
    await sut.add(makeFakeSurvey())
    const count = await surveyCollection.countDocuments()
    expect(count).toBe(1)
  })
})
