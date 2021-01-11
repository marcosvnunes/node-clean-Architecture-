import { Router } from 'express'
import { adaptMiddleware } from '../adapters/express/express-middleware-adapter'
import { adaptRoute } from '../adapters/express/express-routes-adapter'
import { makeSurveyController } from '../factories/controllers/survey/survey-factory'
import { makeAuthMiddleware } from '../factories/middlewares/auth-middleware-factory'

export default (router: Router): void => {
  const authMiddleware = adaptMiddleware(makeAuthMiddleware('admin'))
  router.post('/survey', authMiddleware, adaptRoute(makeSurveyController()))
}
