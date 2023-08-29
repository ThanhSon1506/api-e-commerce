const { Router } = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const router = Router();

// Get All users
router.get("/", authMiddleware.verifyToken, userController.getAllUsers);
// Delete user
router.delete("/:id", authMiddleware.verifyTokenAndAdminAuth, userController.deleteUser);

module.exports = router;    