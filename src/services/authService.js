import expressAsyncHandler from 'express-async-handler'
import httpStatus from 'http-status'
import ApiError from '~/utils/ApiError'
import { tokenService, userService } from '.'
import jwt from 'jsonwebtoken'
import { tokenTypes } from '~/config/tokens'
import config from '~/config/config'
import Token from '~/models/Token'
import RedisClient from '~/config/initRedis'
const authService = {
  /**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
  loginUserWithEmailAndPassword :expressAsyncHandler( async (email, password) => {
    const user = await userService.getUserByEmail(email)
    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Email hoặc Mật khẩu không chính xác')
    }
    if (!(await user.isCorrectPassword(password))) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Email hoặc Mật khẩu không chính xác')
    }
    return user
  }),
  /**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
  refreshAuth: expressAsyncHandler(async (refreshToken) => {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH)
    const user = await userService.getUserById(refreshTokenDoc.user)
    if (!user) {
      throw new Error()
    }
    await refreshTokenDoc.deleteOne()
    const tokens = await tokenService.generateAuthTokens(user)
    return tokens
  }),
  /**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
  logout : async (refreshToken) => {
    const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false })
    if (!refreshTokenDoc) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not found refresh token')
    }
    await refreshTokenDoc.deleteOne()
    jwt.verify(refreshToken, config.jwt.secret, async (err, user) => {
      if (err) new ApiError(httpStatus.NOT_FOUND, 'Not found refresh token')
      await RedisClient.del(user.id)
    })
  },

  /**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
  resetPassword :expressAsyncHandler( async (resetPasswordToken, newPassword) => {
    try {
      const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD)
      const user = await userService.getUserById(resetPasswordTokenDoc.user)

      if (!user) {
        throw new Error()
      }
      await userService.updateUserById(user.id, { password: newPassword })
      await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD })
    } catch (error) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed')
    }
  }),
  /**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
  verifyEmail :expressAsyncHandler( async (verifyEmailToken) => {
    const verifyEmailTokenDoc = await tokenService.verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL)
    const user = await userService.getUserById(verifyEmailTokenDoc.user)
    if (!user) {
      throw new Error()
    }
    await userService.updateUserById(user.id, { isEmailVerified: true })
    await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL })
  })
}
module.exports = authService
