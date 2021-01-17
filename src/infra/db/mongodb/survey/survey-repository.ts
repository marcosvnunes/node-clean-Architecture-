import { AddSurveyRepository, AddSurveyModel } from './survey-repository-protocols'
import { MongoHelper } from '../helpers/mongo-helper'
import { LoadSurveysRepository } from '../../../../data/protocols/db/survey/load-surveys-repository'
import { SurveyModel } from '../../../../domain/models/survey'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository {
  async add (SurveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(SurveyData)
  }

  async loadAll (): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const surveys = await surveyCollection.find<SurveyModel>().toArray()
    return surveys
  }
}
