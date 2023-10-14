const { Router } = require('express')
const authController = require('~/controllers/authController')
const { verifyRefreshToken, verifyToken } = require('~/middleware/authMiddleware')
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register as user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: must be unique
 *               lastName:
 *                 type: string
 *               firstName:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: At least one number and one letter
 *               mobile:
 *                 type: string
 *             example:
 *               firstName: dew
 *               lastName: test
 *               email: admin@gmail.com
 *               password: 123456
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 */

const router = Router()
router.post('/register', authController.postRegister)
router.post('/login', authController.postLogin)
router.post('/refresh', verifyRefreshToken, authController.requestRefreshToken)
router.post('/logout', verifyToken, authController.userLogout)
router.post('/forgot-password', authController.forgotPassword)
router.put('/reset-password', authController.resetPassword)
router.post('/email-verification', verifyToken, authController.sendVerificationEmail)
router.put('/email-confirmation', authController.verifyEmail)
module.exports = router