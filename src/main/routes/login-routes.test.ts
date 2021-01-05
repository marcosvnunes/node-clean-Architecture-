import { Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'
import bcrypt from 'bcrypt'

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
  describe('Sign Post ', () => {
    test('should return 200 on success', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'marcos nunes',
          email: 'marcosnunescomercial@gmail.com',
          password: '123',
          passwordConfirmation: '123'
        })
        .expect(200)
    })
  })

  describe('login Post', () => {
    test('should return 200 on success', async () => {
      const password = await bcrypt.hash('123', 12)
      await accountCollection.insertOne({
        name: 'marcos nunes',
        email: 'marcosnunescomercial@gmail.com',
        password
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'marcosnunescomercial@gmail.com',
          password: '123'
        })
        .expect(200)
    })

    test('should return 401 on fails', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'marcosnunescomercial@gmail.com',
          password: '123'
        })
        .expect(401)
    })
  })
})
