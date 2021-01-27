import { MongoHelper } from '../helpers/mongo-helper'
import { SaveSurveyResultRepository } from '../../../../data/protocols/db/survey/save-survey-result-repository'
import { SaveSurveyResultParams } from '../../../../domain/usercases/save-survey-result'
import { SurveyResultModel } from '../../../../domain/models/survey-result'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    const surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    const res = await surveyResultCollection.findOneAndUpdate({
      accountId: data.accountId,
      surveyId: data.surveyId
    }, {
      $set: {
        answer: data.answer,
        date: data.date
      }
    }, {
      upsert: true,
      returnOriginal: false
    })
    return res.value && MongoHelper.map(res.value)
  }
}
