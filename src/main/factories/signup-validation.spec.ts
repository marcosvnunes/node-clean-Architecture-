import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation'
import { Validation } from '../../presentation/helpers/validators/validation'
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite'
import { makeValidationComposite } from './signup-validation'

jest.mock('../../presentation/helpers/validators/validation-composite')
describe('SignUpValidation factory', () => {
  test('should Call validationComposite with all validations', () => {
    makeValidationComposite()
    const validations: Validation[] = []
    for (const validation of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(validation))
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
