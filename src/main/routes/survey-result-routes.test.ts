import request from 'supertest'
import app from '../config/app'

describe('Survey Routes', () => {
  describe('Survey Result ', () => {
    test('should return 403 if accessToken no is provided', async () => {
      await request(app)
        .put('/api/survey/any_id/results')
        .send({
          answer: 'answer'
        })
        .expect(403)
    })
  })
})
