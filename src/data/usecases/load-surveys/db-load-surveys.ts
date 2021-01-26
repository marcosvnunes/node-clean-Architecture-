import { SurveyModel, LoadSurvey, LoadSurveysRepository } from './db-load-surveys-protocols'

export class DbLoadSurveys implements LoadSurvey {
  constructor (private readonly loadSurveysRepository: LoadSurveysRepository) {}
  async load (): Promise<SurveyModel[]> {
    const surveys = await this.loadSurveysRepository.loadAll()
    return surveys
  }
}
