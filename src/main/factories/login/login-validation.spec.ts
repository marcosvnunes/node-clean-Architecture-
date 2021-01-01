import { RequiredFieldValidation } from '../../../presentation/helpers/validators/required-field-validation'
import { EmailValidation } from '../../../presentation/helpers/validators/email-validation'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'
import { Validation } from '../../../presentation/helpers/validators/validation'
import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite'
import { makeValidationComposite } from './login-validation'

jest.mock('../../../presentation/helpers/validators/validation-composite')
describe('SignUpValidation factory', () => {
  test('should Call validationComposite with all validations', () => {
    makeValidationComposite()
    const validations: Validation[] = []
    for (const validation of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(validation))
    }
    validations.push(new EmailValidation('email', new EmailValidatorAdapter()))

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
