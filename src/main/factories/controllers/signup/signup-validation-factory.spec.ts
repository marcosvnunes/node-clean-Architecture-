import {
  RequiredFieldValidation,
  EmailValidation,
  CompareFieldsValidation,
  ValidationComposite
} from '../../../../validation/validators'
import { EmailValidatorAdapter } from '../../../../infra/validators/email-validator-adapter'
import { Validation } from '../../../../presentation/protocols/validation'
import { makeValidationComposite } from '../signup/signup-validation-factory'

jest.mock('../../../../validation/validators/validation-composite')
describe('SignUpValidation factory', () => {
  test('should Call validationComposite with all validations', () => {
    makeValidationComposite()
    const validations: Validation[] = []
    for (const validation of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(validation))
    }
    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
    validations.push(new EmailValidation('email', new EmailValidatorAdapter()))

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
