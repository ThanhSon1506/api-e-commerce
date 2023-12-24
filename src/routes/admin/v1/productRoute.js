import express from 'express'
import extendRouter from '~/utils/extendRouter'
import productController from '~/controllers/productController'
import auth from '~/middleware/auth'
import validate from '~/middleware/validate'
import productValidation from '~/validations/product.validation'
import { uploadCloud } from '~/config/cloudinary.config'

const router = extendRouter(express.Router())

// ======================================CRUD PRODUCT================================
router
  .routeWithTag('/', { tag: 'product' })
  .post(auth('manageProducts'), validate(productValidation.createProduct), productController.createProduct)
  .get(auth('manageProducts'), validate(productValidation.getProducts), productController.getProducts)

router
  .routeWithTag('/ratings', { tag: 'product' })
  .put(auth(), validate(productValidation.ratingProduct), productController.ratingProduct)

router
  .routeWithTag('/upload/:pid', { tag: 'product' })
  .put(auth('manageProducts'), uploadCloud.array('images', 10), productController.uploadImagesProduct)

router
  .routeWithTag('/:pid', { tag: 'product' })
  .get(validate(productValidation.getProduct), productController.getProduct)
  .put(auth('manageProducts'), validate(productValidation.updateProduct), productController.updateProduct)
  .delete(auth('manageProducts'), validate(productController.deleteProduct), productController.deleteProduct)

export default router
