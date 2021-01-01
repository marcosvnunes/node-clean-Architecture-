import { InvalidParamError } from '../../erros'
import { Validation } from './validation'
import { ValidationComposite } from './validation-composite'

interface SutTypes {
  sut: ValidationComposite
  validationStub: Validation
  validationStub2: Validation
}

const makeSut = (): SutTypes => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  const validationStub = new ValidationStub()
  const validationStub2 = new ValidationStub()
  const sut = new ValidationComposite([validationStub, validationStub2])
  return {
    sut,
    validationStub,
    validationStub2
  }
}

describe('Validation Composite', () => {
  test('should return an Error if validations fails', () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new InvalidParamError('field'))
    const error = sut.validate({ any_field: 'any_value' })
    expect(error).toEqual(new InvalidParamError('field'))
  })

  test('should return an Error if any validations fails', () => {
    const { sut, validationStub2 } = makeSut()
    jest.spyOn(validationStub2, 'validate').mockReturnValueOnce(new InvalidParamError('field'))
    const error = sut.validate({ any_field: 'any_value' })
    expect(error).toEqual(new InvalidParamError('field'))
  })

  test('should no return on success', () => {
    const { sut } = makeSut()
    const error = sut.validate({ any_field: 'any_value' })
    expect(error).toBeFalsy()
  })
})
