import { InvalidParamError } from '../../presentation/erros'
import { CompareFieldsValidation } from './compare-fields-validation'

describe('Compare fields validation', () => {
  test('should return InvalidParamError if validation fails', () => {
    const sut = new CompareFieldsValidation('password', 'passwordConfirmation')
    const error = sut.validate({ password: 'any_password', passwordConfirmation: 'other_password' })
    expect(error).toEqual(new InvalidParamError('passwordConfirmation'))
  })

  test('should return falsy on success', () => {
    const sut = new CompareFieldsValidation('password', 'passwordConfirmation')
    const error = sut.validate({ password: 'any_password', passwordConfirmation: 'any_password' })
    expect(error).toBeFalsy()
  })
})
