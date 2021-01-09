import { AddSurveyModel } from '../../../../domain/usercases/add-Survey'

export interface AddSurveyRepository {
  add(SurveyData: AddSurveyModel): Promise<void>
}
