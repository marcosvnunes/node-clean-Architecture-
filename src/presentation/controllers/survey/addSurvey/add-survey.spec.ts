import { SurveyController } from './add-survey'
import { Validation } from '../../../protocols/validation'

describe('AddSurvey Controller', () => {
  test('should call validation with correct values', async () => {
    class ValidationStub implements Validation {
      validate (input: any): Error {
        return null
      }
    }

    const validationStub = new ValidationStub()
    const sut = new SurveyController(validationStub)
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = {
      body: {
        question: 'any_question',
        answers: [{
          answer: 'any_answer',
          image: 'any_image'
        }]
      }
    }
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })
})
