import { InvalidParamError } from '../../erros'
import { CompareFieldsValidation } from './compare-fields-validation'

describe('Compare fields validation', () => {
  test('should return InvalidParamError if validation fails', () => {
    const sut = new CompareFieldsValidation('password', 'passwordConfirmation')
    const error = sut.validate({ password: 'any_password', passwordConfirmation: 'other_password' })
    expect(error).toEqual(new InvalidParamError('passwordConfirmation'))
  })
})
