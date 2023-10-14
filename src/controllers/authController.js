
import expressAsyncHandler from 'express-async-handler'
import httpStatus from 'http-status'
import emailService from '~/services/emailService'
const { authService, userService, tokenService } = require('../services')
/*
Store token
1) Local storage
 XSS : sẽ bị chạy lệnh script lấy token
2) HTTPONLY Cookies
 - ít bị ảnh hưởng xss, nhưng lại nguy hiểm với tk tấn công CSRF
 - Có thể khắc phục CSRF -> SAMESITE của tk cookie
3) Redux Store -> ACCESS TOKEN
   HTTPONLY COOKIES -> REFRESHTOKEN

=> BFF PATERN (Backend for Frontend)
=================================================================
== refresh token => cấp mới access token
== access token => xác thực người dùng, phân quyền người dùng
**/

/**
 * register auth
 * @param {string} password
 * @param {string} email
 * @param {string} lastName
 * @param {string} firstName
 * @param {string} phone
 * @returns {Promise<Object>}
 */
const authController = {
  postRegister: expressAsyncHandler(async (req, res) => {
    const newUser = await userService.createUser(req.body)
    const tokens = await tokenService.generateAuthTokens(newUser)
    const accessToken= tokens.access.token

    res.status(httpStatus.CREATED).send({
      status: newUser ? true : false,
      accessToken,
      message: newUser ? 'Register successfully' : 'Something went wrong'
    })
  }),
  /**
 * Login auth
 * @param {string} password
 * @param {string} email
 * @returns {Promise<Object>}
 */
  postLogin: expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body
    const user = await authService.loginUserWithEmailAndPassword(email, password)
    const tokens = await tokenService.generateAuthTokens(user)
    const accessToken= tokens.access.token
    res.cookie('refreshToken', tokens.refresh.token, {
      httpOnly: true,
      secure: false,
      path: '/',
      sameSite: 'strict'
    })
    // eslint-disable-next-line no-unused-vars
    const { password: userPassword, role, ...other } = user._doc
    return res.send({ status:true, message:'Login successfully', accessToken, other })
  }),
  /**
 * Logout auth
 * @param {cookie} refreshToken
 * @returns {Promise<Object>}
 */
  userLogout: expressAsyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken
    await authService.logout(refreshToken)
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true
    })
    return res.status(200).json({ success: true, message: 'Logged out!' })
  }),
  /**
 * refresh token in auth
 * @param {cookie} refreshToken
 * @returns {Promise<Object>}
 */
  requestRefreshToken: expressAsyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken
    const tokens = await authService.refreshAuth(refreshToken)
    const newAccessToken=tokens.access.token
    res.cookie('refreshToken', tokens.refresh.token, {
      httpOnly: true,
      secure: false,
      path: '/',
      sameSite: 'strict'
    })
    return res.status(200).json({ accessToken: newAccessToken })
  }),
  /**
 * forgot password
 * @param {body} email
 * @returns {Promise<Object>}
 */
  forgotPassword : expressAsyncHandler(async (req, res) => {
    const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email)
    await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken)
    res.status(httpStatus.NO_CONTENT).send()
  }),
  /**
 * reset password
 * @param {body} token
 * @param {body} password
 * @returns {Promise<Object>}
 */
  resetPassword : expressAsyncHandler(async (req, res) => {
    await authService.resetPassword(req.query.token, req.body.password)
    res.status(httpStatus.NO_CONTENT).send()
  }),
  sendVerificationEmail : expressAsyncHandler(async (req, res) => {
    const user = await userService.getUserById(req.user.sub)
    const verifyEmailToken = await tokenService.generateVerifyEmailToken(user)
    await emailService.sendVerificationEmail(user.email, verifyEmailToken)
    res.status(httpStatus.NO_CONTENT).send()
  }),
  verifyEmail : expressAsyncHandler(async (req, res) => {
    await authService.verifyEmail(req.query.token)
    res.status(httpStatus.NO_CONTENT).send()
  })
}
module.exports = authController
