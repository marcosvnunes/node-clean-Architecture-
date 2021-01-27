import { AddSurveyRepository, AddSurveyParams } from './survey-repository-protocols'
import { MongoHelper } from '../helpers/mongo-helper'
import { LoadSurveysRepository } from '../../../../data/protocols/db/survey/load-surveys-repository'
import { SurveyModel } from '../../../../domain/models/survey'
import { ObjectId } from 'mongodb'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository {
  async add (SurveyData: AddSurveyParams): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(SurveyData)
  }

  async loadAll (): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const surveys = await surveyCollection.find<SurveyModel>().toArray()
    return MongoHelper.mapCollection(surveys)
  }

  async loadById (id: string): Promise<SurveyModel> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const survey = await surveyCollection.findOne({ _id: new ObjectId(id) })
    return survey && MongoHelper.map(survey)
  }
}
