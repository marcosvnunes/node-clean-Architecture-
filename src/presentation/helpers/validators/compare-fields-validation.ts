import { InvalidParamError } from '../../erros'
import { Validation } from './validation'

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
