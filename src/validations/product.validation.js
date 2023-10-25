const Joi = require('@hapi/joi')
const { objectId } = require('./custom.validation')

const productValidation = {
  createProduct: {
    body: Joi.object().keys({
      title: Joi.string().required().messages({
        'string.base': 'Title phải là một chuỗi',
        'string.empty': 'Title không được để trống',
        'any.required': 'Title là trường bắt buộc'
      }),
      price: Joi.number().required().messages({
        'number.base': 'Price phải là một số',
        'number.empty': 'Price không được để trống',
        'any.required': 'Price là trường bắt buộc'
      }),
      brand: Joi.string().required().messages({
        'string.base': 'Brand phải là một chuỗi',
        'string.empty': 'Brand không được để trống',
        'any.required': 'Brand là trường bắt buộc'
      }),
      description: Joi.string().required().messages({
        'string.base': 'Description phải là một chuỗi',
        'string.empty': 'Description không được để trống',
        'any.required': 'Description là trường bắt buộc'
      })
    })
  },
  getProducts: {
    query: Joi.object().keys({
      title: Joi.string(),
      role: Joi.string(),
      sortBy: Joi.string(),
      limit: Joi.number().integer(),
      page: Joi.number().integer()
    })
  },
  getProduct: {
    params: Joi.object().keys({
      productId: Joi.string().custom(objectId)
    })
  },
  updateProduct: {
    params: Joi.object().keys({
      productId: Joi.required().custom(objectId)
    }),
    body: Joi.object().keys({
      title: Joi.string(),
      price: Joi.number(),
      brand: Joi.string(),
      description: Joi.string()
    }).min(1)
  },
  deleteProduct: {
    params: Joi.object().keys({
      productId: Joi.string().custom(objectId)
    })
  },
  ratingProduct: {
    body: Joi.object().keys({
      star: Joi.number().integer().min(1).max(5).required().messages({
        'number.base': 'Star phải là một số',
        'number.integer': 'Star phải là số nguyên',
        'number.min': 'Star phải lớn hơn hoặc bằng 1',
        'number.max': 'Star phải nhỏ hơn hoặc bằng 5',
        'any.required': 'Star là trường bắt buộc'
      }),
      comment: Joi.string().required().messages({
        'string.base': 'Comment phải là một chuỗi',
        'string.empty': 'Comment không được để trống',
        'any.required': 'Comment là trường bắt buộc'
      }),
      pid: Joi.string().required().custom(objectId).messages({
        'string.base': 'PID phải là một chuỗi',
        'string.empty': 'PID không được để trống',
        'any.required': 'PID là trường bắt buộc',
        'custom': 'PID không hợp lệ'
      })
    })
  }
}

module.exports = productValidation