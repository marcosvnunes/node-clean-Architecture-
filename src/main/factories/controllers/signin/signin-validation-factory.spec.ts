import {
  RequiredFieldValidation,
  EmailValidation,
  ValidationComposite
} from '../../../../validation/validators'

import { Validation } from '../../../../presentation/protocols/validation'
import { EmailValidatorAdapter } from '../../../../infra/validators/email-validator-adapter'
import { makeValidationComposite } from '../signin/signin-validation-factory'

jest.mock('../../../../validation/validators/validation-composite')
describe('LoginValidation factory', () => {
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
