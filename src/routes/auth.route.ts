import express, { Router } from 'express'
import asyncHandler from 'express-async-handler'
import { signup } from '../contollers/auth.controller'

const router = express.Router()

export function authRoutes(): Router {
    router.route('/signup').post(asyncHandler(signup))
  return router
}