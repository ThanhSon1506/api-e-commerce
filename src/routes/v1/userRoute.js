const { Router } = require('express')
const userController = require('~/controllers/userController')
const authMiddleware = require('~/middleware/authMiddleware')
const router = Router()

const { verifyToken, verifyAdminAuth } = authMiddleware
//CRUD user
router.get('/', [verifyToken, verifyAdminAuth], userController.getAllUsers)
router.delete('/', [verifyToken, verifyAdminAuth], userController.deleteUser)
router.put('/:uid', [verifyToken, verifyAdminAuth], userController.updateUser)
router.put('/current', [verifyToken], userController.updateUser)
router.get('/current', verifyToken, userController.getCurrent)
// Get reset password
router.get('/forgot-password', userController.forgotPassword)
router.put('/reset-password', userController.resetPassword)


module.exports = router