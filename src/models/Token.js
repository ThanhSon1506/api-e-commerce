const mongoose = require('mongoose')
const { tokenTypes } = require('../config/tokens')

const tokenSchema = mongoose.Schema(
  {
    token: {
      type: mongoose.Schema.Types.String,
      required: true,
      index: true
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true
    },
    type: {
      type: mongoose.Schema.Types.String,
      enum: [tokenTypes.REFRESH, tokenTypes.RESET_PASSWORD, tokenTypes.VERIFY_EMAIL],
      required: true
    },
    expires: {
      type: mongoose.Schema.Types.Date,
      required: true
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
const Token = mongoose.model('Token', tokenSchema)

module.exports = Token
