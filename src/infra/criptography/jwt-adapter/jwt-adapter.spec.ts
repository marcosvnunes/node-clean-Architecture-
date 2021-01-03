import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return new Promise(resolve => resolve('any_token'))
  }
}))

describe('Jwt Adapter', () => {
  test('should call jwt with correct values', async () => {
    jest.spyOn(jwt, 'sign')
    const sut = new JwtAdapter('secret')
    await sut.encrypt('any_id')
    expect(jwt.sign).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
  })

  test('should return accessToken if jwt on successed', async () => {
    const sut = new JwtAdapter('secret')
    const accessToken = await sut.encrypt('any_id')
    expect(accessToken).toBe('any_token')
  })
})
