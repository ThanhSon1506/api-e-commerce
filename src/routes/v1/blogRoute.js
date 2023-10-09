const { Router } = require('express')
const blogController = require('~/controllers/blogController')
const authMiddleware = require('~/middleware/authMiddleware')
const router = Router()

const { verifyToken, verifyAdminAuth } = authMiddleware
//CRUD user
router.post('/', [verifyToken, verifyAdminAuth], blogController.createBlog)

module.exports = router