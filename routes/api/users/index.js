import express from 'express'
import { registration, login, logout, currentUser, uploadAvatar, verifyUser, repeatEmailForVerifyUser } from '../../../controllers/users'
import guard from '../../../middlewares/guard'
import {upload} from '../../../middlewares/upload'
import {validateUser, validateMail} from './validation'

const router = express.Router()

router.post('/signup', validateUser, registration)
router.post('/login', validateUser, login)
router.post('/logout', guard, logout)
router.post('/current', guard, currentUser)
router.patch('/avatars', guard, upload.single('avatar'), uploadAvatar)
router.get('/verify/:verificationToken', verifyUser)
router.post('/verify', validateMail, repeatEmailForVerifyUser)



export default router