const uploadCloud = require('~/config/cloudinary.config')
const productController = require('~/controllers/productController')
const auth = require('~/middleware/auth')
const validate = require('~/middleware/validate')
const productValidation = require('~/validations/product.validation')
const express = require('express')
const extendRouter = require('~/utils/extendRouter')
const router = extendRouter(express.Router())

//======================================CRUD PRODUCT================================
router
  .routeWithTag('/', { tag: 'product' })
  .post( auth('manageProducts'), validate(productValidation.createProduct), productController.createProduct)
  .get( validate(productValidation.getProducts), productController.getProducts)
router
  .routeWithTag('/ratings', { tag: 'product' })
  .put(auth(), validate(productValidation.ratingProduct), productController.ratingProduct)
router
  .routeWithTag('/upload/:pid', { tag: 'product' })
  .put(auth('manageProducts'), uploadCloud.array('images', 10), productController.uploadImagesProduct)
router
  .routeWithTag('/:pid', { tag: 'product' })
  .get( validate(productValidation.getProduct), productController.getProduct)
  .put( auth('manageProducts'), validate(productValidation.updateProduct), productController.updateProduct)
  .delete( auth('manageProducts'), validate(productController.deleteProduct), productController.deleteProduct)
module.exports = router
