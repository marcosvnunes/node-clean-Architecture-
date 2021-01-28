import { AddSurvey, AddSurveyParams } from '../../domain/usercases/add-Survey'

export const mockAddSurvey = (): AddSurvey => {
  class ValidationStub implements AddSurvey {
    async add (data: AddSurveyParams): Promise<void> {
      return new Promise(resolve => resolve())
    }
  }
  return new ValidationStub()
}
