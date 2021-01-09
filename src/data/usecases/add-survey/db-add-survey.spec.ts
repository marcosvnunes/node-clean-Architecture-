import { DbAddSurvey } from './db-add-survey'
import { AddSurveyRepository, AddSurveyModel } from './db-add-survey-protocols'

const makeFakeSurveyData = (): AddSurveyModel => ({
  question: 'any_question',
  answers: [{
    answer: 'any_answer',
    image: 'any_image'
  }]
})

const makeAddSurveyStub = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add (SurveyData: AddSurveyModel): Promise<void> {
      return new Promise(resolve => resolve())
    }
  }
  return new AddSurveyRepositoryStub()
}
describe('DbAddSurvey UseCase', () => {
  test('should call addSurveyRepository with correct values', async () => {
    const addSurveyRepositoryStub = makeAddSurveyStub()
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')
    const sut = new DbAddSurvey(addSurveyRepositoryStub)
    const FakeAddSurveyData = makeFakeSurveyData()
    await sut.add(FakeAddSurveyData)
    expect(addSpy).toHaveBeenCalledWith(FakeAddSurveyData)
  })
})
