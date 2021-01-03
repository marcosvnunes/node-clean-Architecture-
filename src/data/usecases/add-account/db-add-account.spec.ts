import { Hasher, AccountModel, AddAccountModel, AddAccountRepository } from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'

describe('DbAddAccount Usecase', () => {
  const makeAccountData = (): AddAccountModel => {
    return {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
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

  interface SutTypes {
    sut: DbAddAccount
    hasherStub: Hasher
    addAccountRepositoryStub: AddAccountRepository
  }

  const makesut = (): SutTypes => {
    const hasherStub = makeHasher()
    const addAccountRepositoryStub = makeAddAccountRepository()
    const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub)
    return {
      sut,
      hasherStub,
      addAccountRepositoryStub
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
    const { sut, hasherStub } = makesut()
    const hashSpy = jest.spyOn(hasherStub, 'hash')
    await sut.add(makeAccountData())
    expect(hashSpy).toHaveBeenCalledWith('valid_password')
  })

  test('should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makesut()
    jest.spyOn(hasherStub, 'hash')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.add(makeAccountData())
    await expect(promise).rejects.toThrow()
  })

  test('should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makesut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    await sut.add(makeFakeAccountDB())
    expect(addSpy).toHaveBeenCalledWith(makeFakeAccountDB())
  })

  test('should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makesut()
    jest.spyOn(addAccountRepositoryStub, 'add')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.add(makeAccountData())
    await expect(promise).rejects.toThrow()
  })

  test('should return an account on success', async () => {
    const { sut } = makesut()
    const account = await sut.add(makeAccountData())
    expect(account).toEqual(makeFakeAccountDB())
  })
})
