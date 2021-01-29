import { mockSurveyResultModel } from '../../domain/Fakes'
import { SurveyResultModel } from '../../domain/models/survey-result'
import { SaveSurveyResult, SaveSurveyResultParams } from '../../domain/usercases/save-survey-result'

export const mockSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return Promise.resolve(mockSurveyResultModel())
    }
  }

  return new SaveSurveyResultStub()
}
