import { InvalidParamError } from '../../presentation/erros'
import { Validation } from '../../presentation/protocols/validation'

export class CompareFieldsValidation implements Validation {
  private readonly fieldName: string
  private readonly CompareField: string

  constructor (fieldName: string, compareField: string) {
    this.fieldName = fieldName
    this.CompareField = compareField
  }

  validate (input: any): Error {
    if (input[this.fieldName] !== input[this.CompareField]) {
      return new InvalidParamError(this.CompareField)
    }
  }
}
