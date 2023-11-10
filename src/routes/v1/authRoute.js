const express = require('express')
const authController = require('~/controllers/authController')
const { verifyRefreshToken, verifyToken } = require('~/middleware/authMiddleware')
const validate = require('~/middleware/validate')
const { authValidation } = require('~/validations')
const extendRouter = require('~/utils/extendRouter')
const router = extendRouter(express.Router())


// =================================ROUTER====================================================
router.routeWithTag('/register', { tag: 'Auth' }).post(validate(authValidation.register), authController.postRegister)
router.routeWithTag('/login', { tag: 'Auth' }).post( validate(authValidation.login), authController.postLogin)
router.routeWithTag('/refresh', { tag: 'Auth' }).post( verifyRefreshToken, authController.requestRefreshToken)
router.routeWithTag('/logout', { tag: 'Auth' }).post( verifyToken, authController.userLogout)
router.routeWithTag('/forgot-password', { tag: 'Auth' }).post( validate(authValidation.forgotPassword), authController.forgotPassword)
router.routeWithTag('/reset-password', { tag: 'Auth' }).put( validate(authValidation.resetPassword), authController.resetPassword)
router.routeWithTag('/email-verification', { tag: 'Auth' }).post( verifyToken, authController.sendVerificationEmail)
router.routeWithTag('/email-confirmation', { tag: 'Auth' }).put( authController.verifyEmail)
module.exports = router
