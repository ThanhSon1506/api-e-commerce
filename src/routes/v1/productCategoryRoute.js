const productCategoryController = require('~/controllers/productCategoryController')
const auth = require('~/middleware/auth')
const validate = require('~/middleware/validate')
const productCategoryValidation = require('~/validations/productCategory.validation')
const express = require('express')
const extendRouter = require('~/utils/extendRouter')
const router = extendRouter(express.Router())

//=======================CRUD PRODUCT CATEGORY=================================
router
  .routeWithTag('/', { tag: 'productCategory' })
  .post(auth('manageUsers'), validate(productCategoryValidation.createProductCategory), productCategoryController.createCategory)
  .get(validate(productCategoryValidation.getProductCategories), productCategoryController.getCategory)
router
  .routeWithTag('/:pcid', { tag: 'productCategory' })
  .put(auth('manageUsers'), validate(productCategoryController.updateCategory), productCategoryController.updateCategory)
  .delete(auth('manageUsers'), validate(productCategoryValidation.deleteProductCategory), productCategoryController.deleteCategory)
module.exports = router
