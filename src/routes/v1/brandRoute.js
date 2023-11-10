const brandController = require('~/controllers/brandController')
const auth = require('~/middleware/auth')
const validate = require('~/middleware/validate')
const brandValidation = require('~/validations/brand.validation')
const express = require('express')
const extendRouter = require('~/utils/extendRouter')
const router = extendRouter(express.Router())

//=======================CRUD BRAND=================================
router.
  routeWithTag('/', { tag: 'Brand' })
  .post( auth('manageBrands'), validate(brandValidation.createBrand), brandController.createBrand)
  .get( validate('getBrands'), brandController.getBrands)
router
  .routeWithTag('/:brandId', { tag: 'Brand' })
  .get(validate('getBrand'), brandController.getBrand)
  .put( auth('manageBrands'), brandController.updateBrand)
  .delete(auth('manageBrands'), brandController.deleteBrand)
module.exports = router
