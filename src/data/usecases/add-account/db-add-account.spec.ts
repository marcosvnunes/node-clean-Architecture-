import {
  Hasher,
  AccountModel,
  AddAccountModel,
  AddAccountRepository,
  LoadAccountByEmailRepository
} from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'

describe('DbAddAccount Usecase', () => {
  const makeAccountData = (): AddAccountModel => {
    return {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    }
  }

  const makeHasher = (): Hasher => {
    class HasherStub implements Hasher {
      async hash (value: string): Promise<string> {
        return new Promise(resolve => resolve('hashed_password'))
      }
    }
    return new HasherStub()
  }
  const makeFakeAccount = (): AccountModel => ({
    id: 'any_id',
    email: 'any_email@mail.com',
    password: 'hashed_password',
    name: 'any_name'
  })

  const makeAddAccountRepository = (): AddAccountRepository => {
    class AddAccountRepositoryStub implements AddAccountRepository {
      async add (account: AddAccountModel): Promise<AccountModel> {
        const fakeAccount = {
          id: 'valid_id',
          ...account
        }
        return new Promise(resolve => resolve(fakeAccount))
      }
    }
    return new AddAccountRepositoryStub()
  }

  const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
      async loadByEmail (email: string): Promise<AccountModel> {
        return new Promise(resolve => resolve(makeFakeAccount()))
      }
    }
    return new LoadAccountByEmailRepositoryStub()
  }

  interface SutTypes {
    sut: DbAddAccount
    hasherStub: Hasher
    addAccountRepositoryStub: AddAccountRepository
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  }

  const makeSut = (): SutTypes => {
    const hasherStub = makeHasher()
    const addAccountRepositoryStub = makeAddAccountRepository()
    const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
    const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub)
    return {
      sut,
      hasherStub,
      addAccountRepositoryStub,
      loadAccountByEmailRepositoryStub
    }
  }

  const makeFakeAccountDB = (): AddAccountModel => {
    const fakeAccountDB = Object.assign(
      {},
      makeAccountData(),
      { id: 'valid_id', password: 'hashed_password' }
    )
    return fakeAccountDB
  }

  test('should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()
    const hashSpy = jest.spyOn(hasherStub, 'hash')
    await sut.add(makeAccountData())
    expect(hashSpy).toHaveBeenCalledWith('any_password')
  })

  test('should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.add(makeAccountData())
    await expect(promise).rejects.toThrow()
  })

  test('should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    await sut.add(makeFakeAccountDB())
    expect(addSpy).toHaveBeenCalledWith(makeFakeAccountDB())
  })

  test('should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.add(makeAccountData())
    await expect(promise).rejects.toThrow()
  })

  test('should return an account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.add(makeAccountData())
    expect(account).toEqual(makeFakeAccountDB())
  })

  test('should call loadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.add(makeAccountData())
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('should throw if loadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.add(makeAccountData())
    await expect(promise).rejects.toThrow()
  })
})
