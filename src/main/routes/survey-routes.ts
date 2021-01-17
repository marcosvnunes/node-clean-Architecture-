import { Router } from 'express'
import { adaptRoute } from '../adapters/express/express-routes-adapter'
import { makeLoadSurveyController } from '../factories/controllers/loadSurvey/load-survey-factory'
import { makeAddSurveyController } from '../factories/controllers/survey/add-survey-factory'
import { adminAuth } from '../middlewares/admin-auth'
import { auth } from '../middlewares/auth'

export default (router: Router): void => {
  router.post('/survey', adminAuth, adaptRoute(makeAddSurveyController()))
  router.get('/surveys', auth, adaptRoute(makeLoadSurveyController()))
}
