import { EmailValidation } from '../../../validation/validators/email-validation'
import { RequiredFieldValidation } from '../../../validation/validators/required-field-validation'
import { Validation } from '../../../presentation/protocols/validation'
import { ValidationComposite } from '../../../validation/validators/validation-composite'
import { EmailValidatorAdapter } from '../../../infra/validators/email-validator-adapter'

export const makeValidationComposite = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const validation of ['email', 'password']) {
    validations.push(new RequiredFieldValidation(validation))
  }
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))

  return new ValidationComposite(validations)
}
