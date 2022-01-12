import { HttpCode } from '../../lib/constants'
import UsersService from '../../service/users'
import { UploadAvatarService, LocalAvatarStorage } from '../../service/users/avatarStorage'
const usersService = new UsersService()

const registration = async (req, res, next) => {
    const { email } = req.body
    const isUserExist = await usersService.isUserExist(email)
    if (isUserExist) {
        return res.status(HttpCode.CONFLICT)
    .json({ status: 'conflict', code: HttpCode.CONFLICT, message: 'Email in use' })
    }
    const user = await usersService.create(req.body)
    return res.status(HttpCode.CREATED)
    .json({ status: 'create', code: HttpCode.CREATED, user }) 
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


export { registration, login, logout, currentUser, uploadAvatar }