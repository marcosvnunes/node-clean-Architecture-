import { MongoHelper as sut } from './mongo-helper'

describe('Mongo Helper', () => {
  beforeAll(async () => {
    await sut.connect(process.env.MONGO_URL)
  })

  beforeEach(async () => {
    const accountCollection = await sut.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  afterAll(async () => {
    await sut.disconnect()
  })
  test('should reconnect MongoDB if client is down ', async () => {
    let accountCollection = await sut.getCollection('accounts')
    expect(accountCollection).toBeTruthy()
    await sut.disconnect()
    accountCollection = await sut.getCollection('accounts')
    expect(accountCollection).toBeTruthy()
  })
})
