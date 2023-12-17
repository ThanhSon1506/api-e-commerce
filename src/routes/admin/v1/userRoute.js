const express = require('express')
const userController = require('~/controllers/userController')
const auth = require('~/middleware/auth')
const validate = require('~/middleware/validate')
const extendRouter = require('~/utils/extendRouter')
const userValidation = require('~/validations/user.validation')
const router = extendRouter(express.Router())

//============================CRUD user===============================
router
  .routeWithTag('/', { tag: 'User' })
  .post(auth('manageUsers'), validate(userValidation.createUser), userController.createUser)
  .get(auth('manageUsers'), validate(userValidation.getUsers), userController.getAllUsers)

router
  .routeWithTag('/current', { tag: 'User' })
  .get(auth(), userController.getCurrent)
  .put(auth(), userController.updateUser)

router.routeWithTag('/promote/:uid', { tag: 'User' }).put(auth('manageUsers'), validate(userValidation.promoteUser), userController.promoteUserToAdmin)
router.routeWithTag('/address', { tag: 'User' }).put(auth(), userController.updateUserAddress)
router.routeWithTag('/cart', { tag: 'User' }).put(auth(), userController.updateUserCart)
router
  .routeWithTag('/:uid', { tag: 'User' })
  .delete(auth('manageUsers'), validate(userValidation.deleteUser), userController.deleteUser)
  .put(auth('manageUsers'), validate(userValidation.updateUser), userController.updateUser)

module.exports = router
