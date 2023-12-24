var mongoose = require('mongoose')
var paginate = require('./plugins').paginate
var validator = require('validator')
var bcrypt = require('bcrypt')
var crypto = require('crypto')

var customerSchema = new mongoose.Schema({
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
    validate: [validator.isEmail, 'Please enter a valid email']
  },
  password: {
    type: mongoose.Schema.Types.String,
    required: [true, 'Please enter a password'],
    minlength: [8, 'Minimum password length is 8 characters']
  },
  role: {
    type: mongoose.Schema.Types.Array,
    default: 'user'
  },
  cart: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cart'
    }
  ],
  addresses: {
    type: mongoose.Schema.Types.Array,
    default: []
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
  isEmailVerified: {
    type: mongoose.Schema.Types.Boolean,
    default: false
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
  },
  org_id: {
    type: mongoose.Schema.Types.String,
    required: true
  }
}, {
  timestamps: true
})

customerSchema.pre('save', function (next) {
  if (!this.isModified('password')) {
    next()
  }
  var bcryptSalt = bcrypt.genSaltSync(12)
  this.password = bcrypt.hashSync(this.password, bcryptSalt)
  next()
})

customerSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  var user = await this.findOne({ email: email, _id: { $ne: excludeUserId } })
  return !!user
}

customerSchema.methods = {
  isCorrectPassword: async function (password) {
    return await bcrypt.compare(password, this.password)
  },
  createPasswordChangedToken: async function () {
    var resetToken = crypto.randomBytes(32).toString('hex')
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    this.passwordResetExpires = Date.now() + 15 * 60 * 1000
    return resetToken
  }
}

customerSchema.plugin(paginate)
var customerModel = mongoose.models.Customer || mongoose.model('Customer', customerSchema)

module.exports = customerModel
