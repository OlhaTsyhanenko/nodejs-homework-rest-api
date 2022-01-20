import jwt from 'jsonwebtoken'
import Users from '../../repository/users'

const SECRET_KEY = process.env.JWT_SECRET_KEY

class UsersService { 
    async isUserExist(email) {
        const user = await Users.findByEmail(email)
        return !!user
    }

    async create(body) {
        const { email, subscription, avatarURL, verificationToken } = await Users.create(body)
        return {
            email, subscription, avatarURL, verificationToken
        }
    }

    async getUser(email, password) {
        const user = await Users.findByEmail(email)
        const isValidPassword = await user?.isValidPassword(password)
        if (!isValidPassword || !user?.verify) {
            return null
        }
        return user
    }

    getToken(user) {
        const {id, email} = user
        const payload = { id, email }
        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '60d' })
        return token
    } 

    async setToken(id, token) {
        await Users.updateToken(id, token)
    }

}

export default UsersService