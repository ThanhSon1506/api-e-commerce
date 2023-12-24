const mongoose = require('mongoose')
const { config, tokenTypes } = require('../config')


const tokenSchema = mongoose.Schema(
  {
    token: {
      type: mongoose.Schema.Types.String
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    type: {
      type: mongoose.Schema.Types.String,
      enum: [tokenTypes.REFRESH, tokenTypes.RESET_PASSWORD, tokenTypes.VERIFY_EMAIL]
    },
    expires: {
      type: mongoose.Schema.Types.Date
    },
    blacklisted: {
      type: mongoose.Schema.Types.Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
)

/**
 * @typedef Token
 */
console.log('refreshExpirationDays', config.jwt?.refreshExpirationDays)
tokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: config.jwt?.refreshExpirationDays * 24 * 60 * 60 })
tokenSchema.index({ token: 1, type: 1 })
const TokenModel = mongoose.models.Token || mongoose.model('Token', tokenSchema)
module.exports = TokenModel
