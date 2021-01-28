import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account-repository'
import { mockAddAccountParams, mockAccountFullModel, mockAccountWithAccessTokenModel } from '../../../../domain/Fakes'
import mockdate from 'mockdate'

let accountCollection: Collection
const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository()
}

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    mockdate.set(new Date())
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  afterAll(async () => {
    mockdate.reset()
    await MongoHelper.disconnect()
  })
  describe('add()', () => {
    test('should return an account on add success', async () => {
      const sut = makeSut()
      const account = await sut.add(mockAddAccountParams())
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@mail.com')
      expect(account.password).toBe('any_password')
    })
  })
  describe('loadByEmail()', () => {
    test('should return an account on loadByEmail success', async () => {
      const sut = makeSut()
      await accountCollection.insertOne(mockAddAccountParams())
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
      const result = await accountCollection.insertOne(mockAddAccountParams())
      const accountFake = result.ops[0]

      expect(accountFake.accessToken).toBeFalsy()
      await sut.updateAccessToken(accountFake._id, 'any_token')
      const account = await accountCollection.findOne({ _id: accountFake._id })
      expect(account.accessToken).toBe('any_token')
    })
  })

  describe('loadByToken()', () => {
    test('should return an account on loadByToken without role', async () => {
      const sut = makeSut()
      await accountCollection.insertOne(mockAccountWithAccessTokenModel())
      const account = await sut.loadByToken('any_token')

      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@mail.com')
      expect(account.password).toBe('any_password')
      expect(account.accessToken).toBe('any_token')
    })

    test('should return an account on loadByToken with admin role', async () => {
      const sut = makeSut()
      await accountCollection.insertOne(mockAccountFullModel())
      const account = await sut.loadByToken('any_token', 'admin')

      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@mail.com')
      expect(account.password).toBe('any_password')
      expect(account.accessToken).toBe('any_token')
      expect(account.role).toBe('admin')
    })

    test('should return null on loadByToken with invalid role', async () => {
      const sut = makeSut()
      await accountCollection.insertOne(mockAccountWithAccessTokenModel())
      const account = await sut.loadByToken('any_token', 'admin')

      expect(account).toBeFalsy()
    })

    test('should return null if loadByToken fails', async () => {
      const sut = makeSut()
      const account = await sut.loadByToken('any_token')
      expect(account).toBeFalsy()
    })

    test('should return an account on loadByToken if user is admin', async () => {
      const sut = makeSut()
      await accountCollection.insertOne(mockAccountFullModel())
      const account = await sut.loadByToken('any_token')

      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@mail.com')
      expect(account.password).toBe('any_password')
      expect(account.accessToken).toBe('any_token')
      expect(account.role).toBe('admin')
    })

    test('should return null if loadByToken fails', async () => {
      const sut = makeSut()
      const account = await sut.loadByToken('any_token')
      expect(account).toBeFalsy()
    })
  })
})
