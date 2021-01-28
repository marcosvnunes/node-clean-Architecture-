import { mockSurveysModel } from '../../domain/Fakes'
import { SurveyModel } from '../../domain/models/survey'
import { LoadSurvey } from '../../domain/usercases/load-surveys'

export const mockLoadSurvey = (): LoadSurvey => {
  class LoadSurveysStub implements LoadSurvey {
    async load (): Promise<SurveyModel[]> {
      return new Promise(resolve => resolve(mockSurveysModel()))
    }
  }
  return new LoadSurveysStub()
}
