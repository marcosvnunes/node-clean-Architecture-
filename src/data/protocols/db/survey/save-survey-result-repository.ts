import { SaveSurveyResultModel } from '../../../../domain/usercases/save-survey-result'
import { SurveyResultModel } from '../../../../domain/models/survey-result'

export interface SaveSurveyResultRepository {
  save(SurveyData: SaveSurveyResultModel): Promise<SurveyResultModel>
}
