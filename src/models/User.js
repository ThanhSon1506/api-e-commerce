import mongoose from 'mongoose'
const { isEmail } = require('validator')
const bcrypt = require('bcrypt')
const crypto = require('crypto')


const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true,
    unique: [true, 'Please enter an phone']
  },
  email: {
    type: String,
    unique: [true, 'Please enter an email'],
    required: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please enter an password'],
    minLength: [6, 'Minimum password length is 6 characters']
  },
  role: {
    type: String,
    default: 'user'
  },
  cart: {
    type: Array,
    default: []
  },
  address: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Address'
    }
  ],
  wishlist: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Product'
    }
  ],
  isBlocked: {
    type: Boolean,
    default: false
  },
  refreshToken: {
    type: String
  },
  passwordChangeAt: {
    type: String
  },
  passwordResetToken: {
    type: String
  },
  passwordResetExpires: {
    type: String
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

userSchema.methods = {
  isCorrectPassword: async function (password) {
    return await bcrypt.compare(password, this.password)
  },
  createPasswordChangedToken: async function () {
    const resetToken = crypto.randomBytes(32).toString('hex')
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    this.passwordResetExpires = Date.now() + 15 * 60 * 1000
    return resetToken
  }
}
const userModel = mongoose.model('User', userSchema)

module.exports = userModel