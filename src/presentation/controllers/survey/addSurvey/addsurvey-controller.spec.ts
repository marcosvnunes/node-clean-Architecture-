import { SurveyController } from './addsurvey-controller'
import { MissingParamError } from '../../../erros'
import { badRequest } from '../../../helpers/http/http-helper'
import { AddSurvey, AddSurveyModel, Validation } from './addsurvey-controller-protocols'

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

const makeAddSurveySub = (): AddSurvey => {
  class ValidationStub implements AddSurvey {
    async add (data: AddSurveyModel): Promise<void> {
      return new Promise(resolve => resolve())
    }
  }
  return new ValidationStub()
}

interface SutTypes {
  sut: SurveyController
  validationStub: Validation
  addSurveyStub: AddSurvey
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidationSub()
  const addSurveyStub = makeAddSurveySub()

  const sut = new SurveyController(validationStub, addSurveyStub)
  return {
    sut,
    validationStub,
    addSurveyStub
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

  test('should call addSurvey with correct values', async () => {
    const { sut, addSurveyStub } = makeSut()
    const addSpy = jest.spyOn(addSurveyStub, 'add')
    await sut.handle(makeFakeRequest)
    expect(addSpy).toHaveBeenCalledWith(makeFakeRequest.body)
  })
})
