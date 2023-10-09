const { Router } = require('express')
const productController = require('~/controllers/productController')
const authMiddleware = require('~/middleware/authMiddleware')
const router = Router()

const { verifyToken, verifyAdminAuth } = authMiddleware
//CRUD user
router.post('/', [verifyToken, verifyAdminAuth], productController.createProduct)
router.get('/', productController.getProducts)
router.put('/ratings', verifyToken, productController.ratingProduct)

router.get('/:pid', productController.getProduct)
router.put('/:pid', [verifyToken, verifyAdminAuth], productController.updateProduct)
router.delete('/:pid', [verifyToken, verifyAdminAuth], productController.deleteProduct)
module.exports = router