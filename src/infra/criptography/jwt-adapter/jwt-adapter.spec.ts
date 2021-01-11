import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return new Promise(resolve => resolve('any_token'))
  },
  async verify (): Promise<string> {
    return new Promise(resolve => resolve('any_value'))
  }
}))

describe('Jwt Adapter', () => {
  describe('sign()', () => {
    test('should call sign with correct values', async () => {
      jest.spyOn(jwt, 'sign')
      const sut = new JwtAdapter('secret')
      await sut.encrypt('any_id')
      expect(jwt.sign).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
    })

    test('should return accessToken if sign on successed', async () => {
      const sut = new JwtAdapter('secret')
      const accessToken = await sut.encrypt('any_id')
      expect(accessToken).toBe('any_token')
    })

    test('should throw if sign throws', async () => {
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => { throw new Error() })
      const sut = new JwtAdapter('secret')
      const promise = sut.encrypt('any_id')
      await expect(promise).rejects.toThrow()
    })
  })

  describe('sign()', () => {
    test('should call verify with correct values', async () => {
      jest.spyOn(jwt, 'verify')
      const sut = new JwtAdapter('secret')
      await sut.decrypt('any_id')
      expect(jwt.sign).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
    })
  })
})
