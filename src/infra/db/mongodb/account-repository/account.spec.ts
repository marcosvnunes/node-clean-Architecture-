import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'

let accountCollection: Collection

describe('Account Mongo Repository', () => {
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

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }

  const makeFakeAccount = (): any => ({
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password'
  })

  test('should return an account on add success', async () => {
    const sut = makeSut()
    const account = await sut.add(makeFakeAccount())
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@mail.com')
    expect(account.password).toBe('any_password')
  })

  test('should return an account on loadByEmail success', async () => {
    const sut = makeSut()
    await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
    const account = await sut.loadByEmail('any_email@mail.com')

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@mail.com')
    expect(account.password).toBe('any_password')
  })

  test('should return null if loadByEmail fails', async () => {
    const sut = makeSut()
    const account = await sut.loadByEmail('any_email@mail.com')
    expect(account).toBeFalsy()
  })

  test('should update access token on loadByEmail success', async () => {
    const sut = makeSut()
    const result = await accountCollection.insertOne(makeFakeAccount())

    let account = await accountCollection.findOne({ _id: result.ops[0]._id })
    expect(account.accessToken).toBeFalsy()

    await sut.updateAccessToken(account._id, 'any_token')
    account = await accountCollection.findOne({ _id: result.ops[0]._id })
    expect(account.accessToken).toBe('any_token')
  })
})
