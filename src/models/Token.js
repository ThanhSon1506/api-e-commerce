const mongoose = require('mongoose')
const { tokenTypes } = require('../config/tokens')
const config = require('~/config/config')

const tokenSchema = mongoose.Schema(
  {
    token: {
      type: mongoose.Schema.Types.String
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
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

tokenSchema.index({ 'createdAt': 1 }, { expireAfterSeconds: Number(config.jwt.refreshExpirationDays * 24 * 60 * 60 ) })
tokenSchema.index({ token: 1, type: 1 })

const Token = mongoose.model('Token', tokenSchema)

module.exports = Token
