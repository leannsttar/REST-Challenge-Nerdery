import { Router } from 'express'
import { authRoutes } from './routes/auth.route'

export function router(): Router {
  const router = Router()

  router.use('/api/v1/auth', authRoutes())

  return router
}