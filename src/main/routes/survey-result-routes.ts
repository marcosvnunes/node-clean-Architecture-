import { Router } from 'express'
import { adaptRoute } from '../adapters/express/express-routes-adapter'
import { makeSaveSurveyResultController } from '../factories/controllers/survey-result/save-survey-result-factory'
import { auth } from '../middlewares/auth'

export default (router: Router): void => {
  router.put('/survey/:surveyId/results', auth, adaptRoute(makeSaveSurveyResultController()))
}
