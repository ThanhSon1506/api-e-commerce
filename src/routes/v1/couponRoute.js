const couponController = require('~/controllers/couponController')
const auth = require('~/middleware/auth')
const validate = require('~/middleware/validate')
const couponValidation = require('~/validations/coupon.validation')
const express = require('express')
const extendRouter = require('~/utils/extendRouter')
const router = extendRouter(express.Router())

//=======================CRUD COUPON=================================
router.
  routeWithTag('/', { tag: 'Coupon' })
  .post( auth('manageCoupons'), validate(couponValidation.createCoupon), couponController.createCoupon)
  .get( validate('getCoupons'), couponController.getCoupons)
router
  .routeWithTag('/:couponId', { tag: 'Coupon' })
  .get(validate('getCoupon'), couponController.getCoupon)
  .put( auth('manageCoupons'), couponController.updateCoupon)
  .delete(auth('manageCoupons'), couponController.deleteCoupon)

module.exports = router

