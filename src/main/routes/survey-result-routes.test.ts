import { sign } from 'jsonwebtoken'
import { Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'
import { env } from '../config/env'

let accountCollection: Collection
let surveyCollection: Collection
describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    accountCollection = await MongoHelper.getCollection('accounts')

    await surveyCollection.deleteMany({})
    await accountCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  describe('Survey Result ', () => {
    test('should return 403 if accessToken no is provided', async () => {
      await request(app)
        .put('/api/survey/any_id/results')
        .send({
          answer: 'answer'
        })
        .expect(403)
    })

    test('should return 200 on SaveSurveyResult success', async () => {
      const res = await accountCollection.insertOne({
        name: 'marcos nunes',
        email: 'marcosnunescomercial@gmail.com',
        password: '123456'
      })
      const id = res.ops[0]._id

      const accessToken = await sign({ id }, env.secretKey)
      await accountCollection.updateOne({ _id: id }, { $set: { accessToken } })
      const resSurvey = await surveyCollection.insertOne({
        question: 'any_question',
        answers: [{
          answer: 'any_answer',
          image: 'any_image'
        }],
        date: new Date()
      })
      await request(app)
        .put(`/api/survey/${resSurvey.ops[0]._id}/results`)
        .set('x-access-token', accessToken)
        .send({
          answer: 'any_answer'
        })
        .expect(200)
    })
  })
})
