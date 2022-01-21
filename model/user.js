import mongoose from 'mongoose'
import {randomUUID} from 'crypto'
import bcryptjs from 'bcryptjs'
import gravatar from 'gravatar';

const { Schema, model } = mongoose;

const userSchema = new Schema({
    name: {
      type: String,
      default: 'Guest',
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
        validate(value) {
            const reg = /\S+@\S+\.\S+/
            return reg.test(String(value).trim().toLowerCase())
      }
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter"
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: {
      type: String,
      default: function () {
        return gravatar.url(this.email, {s: '250'}, true)
      }
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, 'Verify token is required'],
      default: randomUUID,
    },
    }, {
  versionKey: false,
  toJSON: {
    virtuals: true, transform: function (doc, ret) {
      delete ret._id
      return ret
  } },
  toObject: {virtuals: true},
},
);

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcryptjs.genSalt(6)
    this.password = await bcryptjs.hash(this.password, salt)
  }
  next()
})

userSchema.methods.isValidPassword = async function (password) {
  return await bcryptjs.compare(password, this.password)
}

const User = model('user', userSchema)

export default User