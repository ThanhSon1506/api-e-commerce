const { Router } = require('express');
const authController = require('../controllers/authController');

const router = Router();
router.get('/', (req, res) => {
});
router.post('/register', authController.postRegister);
router.post('/login', authController.postLogin);

module.exports = router;