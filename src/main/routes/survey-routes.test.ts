import { Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { sign } from 'jsonwebtoken'
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
  describe('Survey add ', () => {
    test('should return 403 if accessToken no is provided', async () => {
      await request(app)
        .post('/api/survey')
        .send({
          question: 'question',
          answers: [{
            answer: 'answer',
            image: 'http://image.com.br'
          }]
        })
        .expect(403)
    })

    test('should return 204 if accessToken valid is provided', async () => {
      const res = await accountCollection.insertOne({
        name: 'marcos nunes',
        email: 'marcosnunescomercial@gmail.com',
        password: '123456',
        role: 'admin'
      })
      const id = res.ops[0]._id
      const accessToken = await sign({ id }, env.secretKey)
      await accountCollection.updateOne({ _id: id }, { $set: { accessToken } })
      await request(app)
        .post('/api/survey')
        .set('x-access-token', accessToken)
        .send({
          question: 'question',
          answers: [{
            answer: 'answer',
            image: 'http://image.com.br'
          }]
        })
        .expect(204)
    })
  })
  describe('Surveys loadAll ', () => {
    test('should return 403 if accessToken no is provided', async () => {
      await request(app)
        .get('/api/surveys')
        .send()
        .expect(403)
    })

    test('should return 200 on load surveys success', async () => {
      const res = await accountCollection.insertOne({
        name: 'marcos nunes',
        email: 'marcosnunescomercial@gmail.com',
        password: '123456'
      })
      const id = res.ops[0]._id
      const accessToken = await sign({ id }, env.secretKey)
      await accountCollection.updateOne({ _id: id }, { $set: { accessToken } })
      await surveyCollection.insertOne({
        question: 'any_question',
        answers: [{
          answer: 'any_answer',
          image: 'any_image'
        }],
        date: new Date()
      })
      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .expect(200)
    })
  })
})
