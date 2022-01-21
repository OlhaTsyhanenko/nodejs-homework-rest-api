import { HttpCode } from '../../lib/constants'
import UsersService from '../../service/users'
import repositoryUsers from '../../repository/users'
import { UploadAvatarService, LocalAvatarStorage } from '../../service/users/avatarStorage'
import { EmailService, SenderSendgrid } from '../../service/email'
const usersService = new UsersService()

const registration = async (req, res, next) => {
    const { email } = req.body
    const isUserExist = await usersService.isUserExist(email)
    if (isUserExist) {
        return res.status(HttpCode.CONFLICT)
    .json({ status: 'conflict', code: HttpCode.CONFLICT, message: 'Email in use' })
    }
    const user = await usersService.create(req.body)
    const emailService = new EmailService(process.env.NODE_ENV, new SenderSendgrid())
    const isSend = await emailService.sendVerifyEmail(
        email,
        user.name,
        user.verificationToken
    )
    delete user.verificationToken

    return res.status(HttpCode.CREATED)
    .json({ status: 'create', code: HttpCode.CREATED, user: {...user, isSendEmailVerify: isSend} }) 
}

const login = async (req, res, next) => {
    const { email, password } = req.body
    const user = await usersService.getUser(email, password)
    if (!user) {
        return res.status(HttpCode.UNAUTHORIZED)
    .json({ status: 'unauthorized', code: HttpCode.UNAUTHORIZED, message: 'Not authorized' })
    }
    const token = usersService.getToken(user)
    await usersService.setToken(user.id, token)
    const {subscription} = user
    res.status(HttpCode.OK)
    .json({ status: 'OK', code: HttpCode.OK, token,  user: { email, subscription } })
}

const logout = async (req, res, next) => {
    await usersService.setToken(req.user.id, null)
    res.status(HttpCode.NO_CONTENT)
       .json({ status: 'No Content', code: HttpCode.NO_CONTENT, message: 'No Content' })
}

const currentUser = async (req, res, next) => {
    const { email, subscription } = req.user
    res.status(HttpCode.OK)
            .json({ status: 'OK', code: HttpCode.OK, user: { email, subscription } })
}

const uploadAvatar = async (req, res, next) => {
    const uploadService = new UploadAvatarService(LocalAvatarStorage, req.file, req.user)
    const avatarUrl = await uploadService.updateAvatar()
    res.status(HttpCode.OK)
        .json({ status: 'OK', code: HttpCode.OK, avatarUrl })
}

const verifyUser = async (req, res, next) => {
    const verifyToken = req.params.verificationToken
    const userFromToken = await repositoryUsers.findByVerifyToken(verifyToken)
    
    if (userFromToken) {
        await repositoryUsers.updateVerify(userFromToken.id, true)
        return res.status(HttpCode.OK)
        .json({ status: 'OK', code: HttpCode.OK, message: 'Verification successful' })
    }
    res.status(HttpCode.BAD_REQUEST)
        .json({ status: 'Not Found', code: HttpCode.BAD_REQUEST, message: 'User not found' })
}

const repeatEmailForVerifyUser = async (req, res, next) => {
    const { email } = req.body
    const user = await repositoryUsers.findByEmail(email)
    const {verify} = user
    if (!verify) {
        const { email, name, verificationToken } = user
        const emailService = new EmailService(process.env.NODE_ENV, new SenderSendgrid())
        const isSend = await emailService.sendVerifyEmail(email, name, verificationToken)
        if (isSend) {
            return res.status(HttpCode.OK)
                .json({ status: 'OK', code: HttpCode.OK, message: 'Verification email sent' })  
        }
         return res.status(HttpCode.UE)
        .json({ status: 'error', code: HttpCode.UE, message: 'Unprocessable Entity' })  
    }
    res.status(HttpCode.BAD_REQUEST)
        .json({ status: 'Bad Request', code: HttpCode.BAD_REQUEST, message: 'Verification has already been passed' })
}


export { registration, login, logout, currentUser, uploadAvatar, verifyUser, repeatEmailForVerifyUser }