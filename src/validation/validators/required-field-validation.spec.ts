import { MissingParamError } from '../../presentation/erros'
import { RequiredFieldValidation } from './required-field-validation'

describe('Required field validation', () => {
  test('should return MissingParamError if validation fails', () => {
    const sut = new RequiredFieldValidation('field')
    const error = sut.validate({ otherField: 'otherField' })
    expect(error).toEqual(new MissingParamError('field'))
  })

  test('should return falsy on success', () => {
    const sut = new RequiredFieldValidation('field')
    const error = sut.validate({ field: 'field' })
    expect(error).toBeFalsy()
  })
})
