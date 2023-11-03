const Joi = require('@hapi/joi')
const { objectId } = require('./custom.validation')

const CouponValidation = {
  createCoupon: {
    body: Joi.object().keys({
      name: Joi.string().required().messages({
        'string.base': 'name phải là một chuỗi',
        'string.empty': 'name không được để trống',
        'any.required': 'name là trường bắt buộc'
      }),
      discount: Joi.number().integer().min(0).required().messages({
        'number.base': 'discount phải là một số nguyên',
        'number.min': 'discount phải là một số nguyên không âm',
        'any.required': 'discount là trường bắt buộc'
      }),
      expiry: Joi.number().integer().min(0).required().messages({
        'number.base': 'expiry phải là một số nguyên',
        'number.min': 'expiry phải là một số nguyên không âm',
        'any.required': 'expiry là trường bắt buộc'
      })
    })
  },
  getCoupons: {
    query: Joi.object().keys({
      name: Joi.string(),
      role: Joi.string(),
      sortBy: Joi.string(),
      limit: Joi.number().integer(),
      page: Joi.number().integer(),
      select:Joi.string()
    })
  },
  getCoupon: {
    params: Joi.object().keys({
      bid: Joi.string().custom(objectId)
    })
  },
  updateCoupon: {
    params: Joi.object().keys({
      bid: Joi.required().custom(objectId)
    }),
    body: Joi.object().keys({
      name: Joi.string().required().messages({
        'string.base': 'name phải là một chuỗi',
        'string.empty': 'name không được để trống',
        'any.required': 'name là trường bắt buộc'
      }),
      discount: Joi.number().integer().min(0).required().messages({
        'number.base': 'discount phải là một số nguyên',
        'number.min': 'discount phải là một số nguyên không âm',
        'any.required': 'discount là trường bắt buộc'
      }),
      expiry: Joi.number().integer().min(0).required().messages({
        'number.base': 'expiry phải là một số nguyên',
        'number.min': 'expiry phải là một số nguyên không âm',
        'any.required': 'expiry là trường bắt buộc'
      })
    })
  },
  deleteCoupon: {
    params: Joi.object().keys({
      bid: Joi.string().custom(objectId)
    })
  }
}

module.exports = CouponValidation
