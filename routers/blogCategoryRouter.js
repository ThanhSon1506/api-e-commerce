const { Router } = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { BlogCategoryController } = require('../controllers/blogCategoryController');
const router = Router();

const { verifyToken, verifyAdminAuth } = authMiddleware;
//CRUD user
router.post("/", [verifyToken, verifyAdminAuth], BlogCategoryController.createCategory);
router.get("/", BlogCategoryController.getCategory);
router.put("/:bcid", [verifyToken, verifyAdminAuth], BlogCategoryController.updateCategory);
router.delete("/:bcid", [verifyToken, verifyAdminAuth], BlogCategoryController.deleteCategory);

module.exports = router;      