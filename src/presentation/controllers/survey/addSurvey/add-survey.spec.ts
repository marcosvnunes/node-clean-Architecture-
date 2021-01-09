import { SurveyController } from './add-survey'
import { Validation } from '../../../protocols/validation'
import { MissingParamError } from '../../../erros'
import { badRequest } from '../../../helpers/http/http-helper'

const makeFakeRequest = ({
  body: {
    question: 'any_question',
    answers: [{
      answer: 'any_answer',
      image: 'any_image'
    }]
  }
})

const makeValidationSub = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

interface SutTypes {
  sut: SurveyController
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidationSub()
  const sut = new SurveyController(validationStub)
  return {
    sut,
    validationStub
  }
}

describe('AddSurvey Controller', () => {
  test('should call validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(makeFakeRequest)
    expect(validateSpy).toHaveBeenCalledWith(makeFakeRequest.body)
  })

  test('should return 400 if validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_param'))
    const httpResponse = await sut.handle(makeFakeRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_param')))
  })
})
