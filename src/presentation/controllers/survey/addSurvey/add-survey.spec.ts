import { SurveyController } from './add-survey'
import { Validation } from '../../../protocols/validation'

const makeFakeRequest = ({
  body: {
    question: 'any_question',
    answers: [{
      answer: 'any_answer',
      image: 'any_image'
    }]
  }
})

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
    await sut.handle(makeFakeRequest)
    expect(validateSpy).toHaveBeenCalledWith(makeFakeRequest.body)
  })
})
