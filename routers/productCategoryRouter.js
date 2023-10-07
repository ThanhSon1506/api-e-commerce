const { Router } = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { productCategoryController } = require('../controllers/productCategoryController');
const router = Router();

const { verifyToken, verifyAdminAuth } = authMiddleware;
//CRUD user
router.post("/", [verifyToken, verifyAdminAuth], productCategoryController.createCategory);
router.get("/", productCategoryController.getCategory);
router.put("/:pcid", [verifyToken, verifyAdminAuth], productCategoryController.updateCategory);
router.delete("/:pcid", [verifyToken, verifyAdminAuth], productCategoryController.deleteCategory);

module.exports = router;      