import {
  RequiredFieldValidation,
  ValidationComposite
} from '../../../validation/validators'

import { Validation } from '../../../presentation/protocols/validation'
import { makeValidationComposite } from './survey-validation-factory'

jest.mock('../../../validation/validators/validation-composite')
describe('SurveyValidation factory', () => {
  test('should Call validationComposite with all validations', () => {
    makeValidationComposite()
    const validations: Validation[] = []
    for (const validation of ['question', 'answers']) {
      validations.push(new RequiredFieldValidation(validation))
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
