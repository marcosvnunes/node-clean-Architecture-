import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-repository'
import { mockSurveyParams, mockSurveysModel } from '../../../../domain/Fakes'

let surveyCollection: Collection

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

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

  describe('add', () => {
    test('should load surveys on add success', async () => {
      const sut = makeSut()
      await sut.add(mockSurveyParams())
      const count = await surveyCollection.countDocuments()
      expect(count).toBe(1)
    })
  })

  describe('loadAll', () => {
    test('should return all surveys on loadAll success', async () => {
      await surveyCollection.insertMany(mockSurveysModel())
      const sut = makeSut()
      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(2)
      expect(surveys[1].id).toBeTruthy()
      expect(surveys[0].question).toBe('any_question')
      expect(surveys[1].question).toBe('other_question')
    })

    test('should returns an empty array if loadAll finds no surveys ', async () => {
      await surveyCollection.insertMany(mockSurveysModel())
      const sut = makeSut()
      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(2)
      expect(surveys[0].question).toBe('any_question')
      expect(surveys[1].question).toBe('other_question')
    })
  })

  describe('loadById', () => {
    test('should return a survey on loadById success', async () => {
      const res = await surveyCollection.insertOne(mockSurveyParams())
      const sut = makeSut()
      const survey = await sut.loadById(res.ops[0]._id)
      expect(survey).toBeTruthy()
      expect(survey.id).toBeTruthy()
    })

    test('should return falsy on loadById fails', async () => {
      const sut = makeSut()
      const survey = await sut.loadById('any_id_valid')
      expect(survey).toBeFalsy()
    })
  })
})
