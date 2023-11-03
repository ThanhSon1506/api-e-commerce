const { Router } = require('express')
const couponController = require('~/controllers/couponController')
const { useTags, usePaths } =require('~/docs/swagger')
const auth = require('~/middleware/auth')
const validate = require('~/middleware/validate')
const couponValidation = require('~/validations/coupon.validation')
const router = Router()

//=======================CRUD COUPON=================================
router.
  route('/')
  .post( auth('manageCoupons'), validate(couponValidation.createCoupon), couponController.createCoupon)
  .get( validate('getCoupons'), couponController.getCoupons)
router
  .route('/:couponId')
  .get(validate('getCoupon'), couponController.getCoupon)
  .put( auth('manageCoupons'), couponController.updateCoupon)
  .delete(auth('manageCoupons'), couponController.deleteCoupon)

module.exports = router

// TAG NAME AND PATH USER LOGIN
useTags({
  name: 'Coupon',
  description: 'Operations related to user management'
})

usePaths({
  tag: 'Coupon',
  summary: 'Create a new coupon',
  path: '/coupon',
  method: 'post',
  requestBody: {
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Hallow' },
        discount: { type: 'number', example: 2 },
        expiry: { type: 'number', example: 2 }
      },
      required: ['name', 'discount', 'expiry']
    }
  },
  responses: {
    201: {
      description: 'Coupon created successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' },
              coupon: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  discount: { type: 'number' },
                  expiry_date_in_days_from_now : { type : 'number' }
                }
              }
            }
          }
        }
      }
    },
    400: {
      description: 'Bad request',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              error_message : { type : 'string' },
              message : { type : 'string' }
            }
          }
        }
      }
    }
    // ... (other response codes)
  },
  auth_required : true,
  responseSchema : {
    type : 'object',
    properties : {
      success : { type : 'boolean' },
      message : { type : 'string' },
      coupon : {
        type : 'object',
        properties : {
          name : { type : 'string' },
          discount : { type : 'number' },
          expiry_date_in_days_from_now : { type : 'number' }
        }
      }
    }
  }
})
