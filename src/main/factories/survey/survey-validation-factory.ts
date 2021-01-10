import { RequiredFieldValidation } from '../../../validation/validators/required-field-validation'
import { Validation } from '../../../presentation/protocols/validation'
import { ValidationComposite } from '../../../validation/validators/validation-composite'

export const makeValidationComposite = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const validation of ['question', 'answers']) {
    validations.push(new RequiredFieldValidation(validation))
  }

  return new ValidationComposite(validations)
}
