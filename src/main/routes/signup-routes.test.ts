import request from 'supertest'
import app from '../config/app'

describe('SignUp Routes', () => {
  test('should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'marcos nunes',
        email: 'marcosnunescomercial@gmail.com',
        password: '132',
        passwordConfirmation: '123'
      })
      .expect(200)
  })
})
