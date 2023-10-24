const { Router } = require('express')
const authController = require('~/controllers/authController')
const { verifyRefreshToken, verifyToken } = require('~/middleware/authMiddleware')
const validate = require('~/middleware/validate')
const { authValidation } = require('~/validations')
const { useTags, usePaths } =require('~/docs/swagger')
const router = Router()

// TAG NAME AND PATH USER LOGIN
useTags({
  name: 'User',
  description: 'Operations related to user management'
})
usePaths({
  tag: 'User',
  summary: 'Login form user',
  path: '/auth/login',
  method: 'post',
  requestBody: {
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'admin@gmail.com' },
        password: { type: 'string', example: 'admin@123456' }
      },
      required: ['email', 'password']
    }
  },
  responses: {
    200: {
      description: 'Login successful',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              token: { type: 'string' },
              user: { type: 'object' }
            }
          }
        }
      }
    }
  },
  auth: false,
  responseSchema: {
    type: 'object',
    properties: {
      email: { type: 'string', example: 'admin@gmail.com' },
      password : { type: 'string', example: 'admin@123456' },
      additionalProperty: { type: 'string' }
    }
  }
})
router.post('/register', validate(authValidation.register), authController.postRegister)
router.post('/login', validate(authValidation.login), authController.postLogin)
router.post('/refresh', verifyRefreshToken, authController.requestRefreshToken)
router.post('/logout', verifyToken, authController.userLogout)
router.post('/forgot-password', validate(authValidation.forgotPassword), authController.forgotPassword)
router.put('/reset-password', validate(authValidation.resetPassword), authController.resetPassword)
router.post('/email-verification', verifyToken, authController.sendVerificationEmail)
router.put('/email-confirmation', authController.verifyEmail)
module.exports = router
