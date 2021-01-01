import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation'
import { Validation } from '../../presentation/helpers/validators/validation'
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite'

export const makeValidationComposite = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const validation of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldValidation(validation))
  }
  return new ValidationComposite(validations)
}
