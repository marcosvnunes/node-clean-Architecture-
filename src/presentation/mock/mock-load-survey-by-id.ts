import { mockSurveyModel } from '../../domain/Fakes'
import { SurveyModel } from '../../domain/models/survey'
import { LoadSurveyById } from '../../domain/usercases/load-survey-by-id'

export const mockLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (id: string): Promise<SurveyModel> {
      return Promise.resolve(mockSurveyModel())
    }
  }

  return new LoadSurveyByIdStub()
}
