import express from 'express'
import { registration, login, logout, currentUser, uploadAvatar } from '../../../controllers/users'
import guard from '../../../middlewares/guard'
import {upload} from '../../../middlewares/upload'
import {validateUser} from './validation'

const router = express.Router()

router.post('/signup', validateUser, registration)
router.post('/login', validateUser, login)
router.post('/logout', guard, logout)
router.post('/current', guard, currentUser)
router.patch('/avatars', guard, upload.single('avatar'), uploadAvatar)


export default router