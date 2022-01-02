import express from 'express'
import { registration, login, logout } from '../../../controllers/users'
import guard from '../../../middlewares/guard'
import currentUser from '../../../middlewares/currentUser'
import {validateUser} from './validation'



const router = express.Router()

router.post('/signup', validateUser, registration)
router.post('/login', validateUser, login)
router.post('/logout', guard, logout)
router.post('/current', currentUser)

export default router