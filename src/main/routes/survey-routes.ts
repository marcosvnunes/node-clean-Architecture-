import { Router } from 'express'
import { adaptRoute } from '../adapters/express/express-routes-adapter'
import { makeAddSurveyController } from '../factories/controllers/survey/survey-factory'
import { adminAuth } from '../middlewares/admin-auth'
import { auth } from '../middlewares/auth'

export default (router: Router): void => {
  router.post('/survey', adminAuth, adaptRoute(makeAddSurveyController()))
  router.get('/surveys', auth, adaptRoute(makeAddSurveyController()))
}
