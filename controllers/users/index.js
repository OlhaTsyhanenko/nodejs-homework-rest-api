import { HttpCode } from '../../lib/constants'
import UsersService from '../../service/users'
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
    .json({ status: 'unauthorized', code: HttpCode.UNAUTHORIZED, message: 'Email or password is wrong' })
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

export {registration, login, logout}