import { Router } from 'express'
import { adaptRoute } from '../adapters/express/express-routes-adapter'
import { makeSurveyController } from '../factories/survey/survey-factory'

export default (router: Router): void => {
  router.post('/survey', adaptRoute(makeSurveyController()))
}
