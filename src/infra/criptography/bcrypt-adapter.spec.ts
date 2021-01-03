import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return new Promise(resolve => resolve('hash'))
  },
  async compare (value: string, hash: string): Promise<boolean> {
    return new Promise(resolve => resolve(true))
  }
}))

const salt = 12
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('Bcrypt Adapter', () => {
  test('should call hash with correct values', async () => {
    jest.spyOn(bcrypt, 'hash')
    const sut = makeSut()
    await sut.hash('any_value')
    expect(bcrypt.hash).toHaveBeenCalledWith('any_value', salt)
  })

  test('should return a valid hash on hash success', async () => {
    const sut = makeSut()
    const hash = await sut.hash('any_value')
    expect(hash).toBe('hash')
  })

  test('should throw if hash throws', async () => {
    jest.spyOn(bcrypt, 'hash')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const sut = makeSut()
    const promisse = sut.hash('any_value')
    await expect(promisse).rejects.toThrow()
  })

  test('should call compare with correct values', async () => {
    jest.spyOn(bcrypt, 'compare')
    const sut = makeSut()
    await sut.compare('any_value', 'any_hash')
    expect(bcrypt.compare).toHaveBeenCalledWith('any_value', 'any_hash')
  })
})
