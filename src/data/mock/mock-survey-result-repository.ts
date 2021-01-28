import { mockSurveyResultModel } from '../../domain/Fakes'
import { SurveyResultModel } from '../../domain/models/survey-result'
import { SaveSurveyResultParams } from '../../domain/usercases/save-survey-result'
import { SaveSurveyResultRepository } from '../protocols/db/survey/save-survey-result-repository'

export const mockSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save (SurveyData: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return new Promise(resolve => resolve(mockSurveyResultModel()))
    }
  }
  return new SaveSurveyResultRepositoryStub()
}
