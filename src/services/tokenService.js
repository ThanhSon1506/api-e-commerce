import jwt from 'jsonwebtoken'
import expressAsyncHandler from 'express-async-handler'
import redisClient from '~/config/initRedis'
import moment from 'moment'
import config from '~/config/config'
import Token from '~/models/Token'
import { userService } from '.'
import ApiError from '~/utils/ApiError'
import httpStatus from 'http-status'
const { tokenTypes } = require('../config/tokens')
const tokenService ={
  /**
 * Generate token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
  generateToken: (userId, role, expires, type, secret = config.jwt.secret ) => {
    const payload = {
      sub: userId,
      role:role,
      iat: moment().unix(),
      exp: expires.unix(),
      type
    }
    return jwt.sign(payload, secret)
  },

  saveToken : async (token, userId, expires, type, blacklisted = false) => {
    const tokenDoc = await Token.create({
      token,
      user: userId,
      expires: expires.toDate(),
      type,
      blacklisted
    })
    return tokenDoc
  },
  saveTokenWithRedis:async(user, refreshToken) => {
    redisClient.set(user._id.toString(), JSON.stringify({ token: refreshToken }))
  },


  /**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<Token>}
 */

  verifyToken: async (token, type) => {
    const payload = jwt.verify(token, config.jwt.secret)
    const tokenDoc = await Token.findOne({ token, type, user: payload.sub, blacklisted: false })
    if (!tokenDoc) {
      throw new Error('Token not found')
    }
    return tokenDoc
  },
  /**
 * Generate auth token
 * @param {string} user
 * @returns {Promise<string>}
 */
  generateAuthTokens:expressAsyncHandler(async(user) => {
    if (user) {
      const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes')
      const accessToken = tokenService.generateToken(user.id, user.role, accessTokenExpires, tokenTypes.ACCESS)
      const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days')
      const refreshToken = tokenService.generateToken(user.id, user.role, refreshTokenExpires, tokenTypes.REFRESH)
      // Mongo
      await tokenService.saveToken(refreshToken, user.id, refreshTokenExpires, tokenTypes.REFRESH)
      // Redis
      await tokenService.saveTokenWithRedis(user, refreshToken)
      return {
        access: {
          token: accessToken,
          expires: accessTokenExpires.toDate()
        },
        refresh: {
          token: refreshToken,
          expires: refreshTokenExpires.toDate()
        }
      }
    }
  }),
  /**
 * Generate reset password token
 * @param {string} email
 * @returns {Promise<string>}
 */
  generateResetPasswordToken : async (email) => {
    const user = await userService.getUserByEmail(email)
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'No users found with this email')
    }
    const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes')
    const resetPasswordToken = tokenService.generateToken(user.id, null, expires, tokenTypes.RESET_PASSWORD)
    await tokenService.saveToken(resetPasswordToken, user.id, expires, tokenTypes.RESET_PASSWORD)
    return resetPasswordToken
  },

  /**
 * Generate verify email token
 * @param {User} user
 * @returns {Promise<string>}
 */
  generateVerifyEmailToken : async (user) => {
    const expires = moment().add(config.jwt.verifyEmailExpirationMinutes, 'minutes')
    const verifyEmailToken = tokenService.generateToken(user.id, user.role, expires, tokenTypes.VERIFY_EMAIL)
    await tokenService.saveToken(verifyEmailToken, user.id, expires, tokenTypes.VERIFY_EMAIL)
    return verifyEmailToken
  }
}

module.exports=tokenService