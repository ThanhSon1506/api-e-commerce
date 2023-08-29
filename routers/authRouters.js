const { Router } = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = Router();
router.get('/', (req, res) => {
});
router.post('/register', authController.postRegister);
router.post('/login', authController.postLogin);
router.post('/refresh', authMiddleware.verifyRefreshToken, authController.requestRefreshToken);
router.post('/logout', authMiddleware.verifyToken, authController.userLogout);
module.exports = router;