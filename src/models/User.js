import mongoose from 'mongoose'
import { paginate, toJSON } from './plugins'
const { isEmail } = require('validator')
const bcrypt = require('bcrypt')
const crypto = require('crypto')


const userSchema = new mongoose.Schema({
  firstName: {
    type: mongoose.Schema.Types.String,
    required: true
  },
  lastName: {
    type: mongoose.Schema.Types.String,
    required: true
  },
  mobile: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: [true, 'Số điện thoại của bạn đã bị trùng']
  },
  email: {
    type: mongoose.Schema.Types.String,
    unique: [true, 'Email của bạn bị trùng'],
    required: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email']
  },
  password: {
    type: mongoose.Schema.Types.String,
    required: [true, 'Please enter an password'],
    minlength: [8, 'Minimum password length is 8 characters']
  },
  role: {
    type: mongoose.Schema.Types.String,
    default: 'user'
  },
  cart:[{
    product:{ type: mongoose.Schema.Types.ObjectId, ref:'Product' },
    quantity:Number,
    color:mongoose.Schema.Types.String
  }],
  address: {
    type:mongoose.Schema.Types.Array,
    default:[]
  },
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }
  ],
  isBlocked: {
    type: mongoose.Schema.Types.Boolean,
    default: false
  },
  isEmailVerified:{
    type:mongoose.Schema.Types.Boolean,
    default:false
  },
  refreshToken: {
    type: mongoose.Schema.Types.String
  },
  passwordChangeAt: {
    type: mongoose.Schema.Types.String
  },
  passwordResetToken: {
    type: mongoose.Schema.Types.String
  },
  passwordResetExpires: {
    type: mongoose.Schema.Types.String
  }
},
{ timestamps: true }
)

// fire a function after doc saved to db
// userSchema.post('save', function (doc, next) {
//     console.log('new user was created & saved', doc);
//     next();
// });

// fire a function before doc saved to db
userSchema.pre('save', function (next) {
  if (!this.isModified('password')) {
    next()
  }
  const bcryptSalt = bcrypt.genSaltSync(12)
  this.password = bcrypt.hashSync(this.password, bcryptSalt)
  next()
})
/**
 * Check if email is taken
 * @param {mongoose.Schema.Types.String} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } })
  return !!user
}
/**
 * Check if password is change
 * @param {mongoose.Schema.Types.String} password - The user's password
 * @returns {Promise<boolean>}
 */
userSchema.methods = {
  isCorrectPassword: async function (password) {
    return await bcrypt.compare(password, this.password)
  },
  createPasswordChangedToken: async function () {
    const resetToken = crypto.randomBytes(32).tomongoose.Schema.Types.String('hex')
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    this.passwordResetExpires = Date.now() + 15 * 60 * 1000
    return resetToken
  }
}
// add plugin that converts mongoose to json
userSchema.plugin(toJSON)
userSchema.plugin(paginate)
const userModel = mongoose.model('User', userSchema)

module.exports = userModel