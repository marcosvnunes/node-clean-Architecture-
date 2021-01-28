import { SurveyController } from './addsurvey-controller'
import { MissingParamError } from '../../../erros'
import { badRequest, serverError, noContent } from '../../../helpers/http/http-helper'
import { AddSurvey, Validation } from './addsurvey-controller-protocols'
import mockdate from 'mockdate'
import { mockSurveyParams, throwError } from '../../../../domain/Fakes'
import { mockValidation } from '../../../../validation/mock'
import { mockAddSurvey } from '../../../mock'

const mockRequest = ({
  body: mockSurveyParams()
})

interface SutTypes {
  sut: SurveyController
  validationStub: Validation
  addSurveyStub: AddSurvey
}

const makeSut = (): SutTypes => {
  const validationStub = mockValidation()
  const addSurveyStub = mockAddSurvey()

  const sut = new SurveyController(validationStub, addSurveyStub)
  return {
    sut,
    validationStub,
    addSurveyStub
  }
}

describe('AddSurvey Controller', () => {
  beforeAll(() => {
    mockdate.set('2021/1/1')
  })
  afterAll(() => {
    mockdate.reset()
  })
  test('should call validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(mockRequest)
    expect(validateSpy).toHaveBeenCalledWith(mockRequest.body)
  })

  test('should return 400 if validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_param'))
    const httpResponse = await sut.handle(mockRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_param')))
  })

  test('should call addSurvey with correct values', async () => {
    const { sut, addSurveyStub } = makeSut()
    const addSpy = jest.spyOn(addSurveyStub, 'add')
    await sut.handle(mockRequest)
    expect(addSpy).toHaveBeenCalledWith(mockRequest.body)
  })

  test('should return 500 if addSurvey throws', async () => {
    const { sut, addSurveyStub } = makeSut()
    jest.spyOn(addSurveyStub, 'add').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest)
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should return 204 on success', async () => {
    const { sut } = makeSut()
    const hhtpResponse = await sut.handle(mockRequest)
    expect(hhtpResponse).toEqual(noContent())
  })
})
