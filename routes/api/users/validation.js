import Joi from 'joi'
import { HttpCode } from '../../../lib/constants'

const createSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
})

export const validateUser = async (req, res, next) => {
  try {
    await createSchema.validateAsync(req.body)
  } catch (err) {
    return res
      .status(HttpCode.BAD_REQUEST)
          .json({ status: 'Bad Request', code: HttpCode.BAD_REQUEST, message: `Field ${err.message.replace(/"/g, '')}` })
  }
  next()
}


