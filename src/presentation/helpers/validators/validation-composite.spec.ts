import { InvalidParamError } from '../../erros'
import { Validation } from './validation'
import { ValidationComposite } from './validation-composite'

describe('Validation Composite', () => {
  test('should return an Error if validations fails', () => {
    class ValidationStub implements Validation {
      validate (input: any): Error {
        return null
      }
    }
    const validationStub = new ValidationStub()
    const sut = new ValidationComposite([validationStub])
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new InvalidParamError('field'))
    const error = sut.validate({ any_field: 'any_value' })
    expect(error).toEqual(new InvalidParamError('field'))
  })

  test('should no return on success', () => {
    class ValidationStub implements Validation {
      validate (input: any): Error {
        return null
      }
    }
    const validationStub = new ValidationStub()
    const sut = new ValidationComposite([validationStub])
    const error = sut.validate({ any_field: 'any_value' })
    expect(error).toBeFalsy()
  })
})
