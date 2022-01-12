import express from 'express'
import { registration, login, logout, currentUser } from '../../../controllers/users'
import guard from '../../../middlewares/guard'
import {validateUser} from './validation'

const router = express.Router()

router.post('/signup', validateUser, registration)
router.post('/login', validateUser, login)
router.post('/logout', guard, logout)
router.post('/current', guard, currentUser)

export default router