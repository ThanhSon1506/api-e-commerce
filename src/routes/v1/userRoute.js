const express = require('express')
const userController = require('~/controllers/userController')
const auth = require('~/middleware/auth')
const authMiddleware = require('~/middleware/authMiddleware')
const validate = require('~/middleware/validate')
const userValidation = require('~/validations/user.validation')
const router = express.Router()

const { verifyToken, verifyAdminAuth } = authMiddleware
//CRUD user
router
  .route('/')
  .post([auth('manageUsers')], validate(userValidation.createUser), userController.createUser)
  .get( [auth('getUsers'), verifyToken, verifyAdminAuth], userController.getAllUsers)

router
  .route('/current')
  .get( verifyToken, userController.getCurrent)
  .put( [verifyToken], userController.updateUser)

router.put('/promote/:uid', auth('manageUsers'), userController.promoteUserToAdmin)
router
  .route('/:uid')
  .delete( [verifyToken, verifyAdminAuth], userController.deleteUser)
  .put( [verifyToken, verifyAdminAuth], userController.updateUser)


module.exports = router