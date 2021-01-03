import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

describe('Jwt Adapter', () => {
  test('should call jwt with correct values', async () => {
    jest.spyOn(jwt, 'sign')
    const sut = new JwtAdapter('secret')
    await sut.encrypt('any_id')
    expect(jwt.sign).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
  })
})
