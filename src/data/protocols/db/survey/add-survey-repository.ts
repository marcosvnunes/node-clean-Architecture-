import { AddSurveyParams } from '../../../../domain/usercases/add-Survey'

export interface AddSurveyRepository {
  add(SurveyData: AddSurveyParams): Promise<void>
}
