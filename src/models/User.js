var mongoose = require('mongoose')
var paginate = require('./plugins').paginate
var isEmail = require('validator').isEmail
var bcrypt = require('bcrypt')
var crypto = require('crypto')

var userSchema = new mongoose.Schema(
  {
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
      type: mongoose.Schema.Types.Array,
      default: 'user'
    },
    cart: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: Number,
        color: mongoose.Schema.Types.String
      }
    ],
    address: {
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
  },
  { timestamps: true }
)

userSchema.pre('save', function (next) {
  if (!this.isModified('password')) {
    next()
  }
  var bcryptSalt = bcrypt.genSaltSync(12)
  this.password = bcrypt.hashSync(this.password, bcryptSalt)
  next()
})

userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  var user = await this.findOne({ email: email, _id: { $ne: excludeUserId } })
  return !!user
}

userSchema.methods = {
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

userSchema.plugin(paginate)

const UserModel = mongoose.models.User || mongoose.model('User', userSchema)

module.exports = UserModel
