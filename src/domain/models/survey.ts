export interface SurveyModel {
  id: string
  question: string
  answers: SurveyAnswerModel[]
  date: Date
}
export interface SurveyAnswerModel {
  answer: string
  image?: string
}
