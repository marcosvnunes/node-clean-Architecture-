import { SaveSurveyResultParams } from '../../../../domain/usercases/save-survey-result'
import { SurveyResultModel } from '../../../../domain/models/survey-result'

export interface SaveSurveyResultRepository {
  save(SurveyData: SaveSurveyResultParams): Promise<SurveyResultModel>
}
