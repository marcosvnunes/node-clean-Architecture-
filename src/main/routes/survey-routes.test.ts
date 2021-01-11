import { Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'

let accountCollection: Collection
describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  describe('Survey Post ', () => {
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
  })
})
