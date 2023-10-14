const { Router } = require('express')
const userController = require('~/controllers/userController')
const authMiddleware = require('~/middleware/authMiddleware')
const router = Router()

const { verifyToken, verifyAdminAuth } = authMiddleware
//CRUD user
router.get('/', [verifyToken, verifyAdminAuth], userController.getAllUsers)
router.get('/current', verifyToken, userController.getCurrent)
router.delete('/:uid', [verifyToken, verifyAdminAuth], userController.deleteUser)
router.put('/current', [verifyToken], userController.updateUser)
router.put('/:uid', [verifyToken, verifyAdminAuth], userController.updateUser)


module.exports = router