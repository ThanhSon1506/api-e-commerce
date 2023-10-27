const Joi = require('@hapi/joi')
const { objectId } = require('./custom.validation')

const productCategoryValidation = {
  createProductCategory: {
    body: Joi.object().keys({
      title: Joi.string().required().messages({
        'string.base': 'Title phải là một chuỗi',
        'string.empty': 'Title không được để trống',
        'any.required': 'Title là trường bắt buộc'
      })
    })
  },
  getProductCategories: {
    query: Joi.object().keys({
      title: Joi.string(),
      role: Joi.string(),
      sortBy: Joi.string(),
      limit: Joi.number().integer(),
      page: Joi.number().integer()
    })
  },
  getProductCategory: {
    params: Joi.object().keys({
      pcid: Joi.string().custom(objectId)
    })
  },
  updateProductCategory: {
    params: Joi.object().keys({
      pcid: Joi.required().custom(objectId)
    }),
    body: Joi.object().keys({
      title: Joi.string().required().messages({
        'string.base': 'Title phải là một chuỗi',
        'string.empty': 'Title không được để trống',
        'any.required': 'Title là trường bắt buộc'
      })
    })
  },
  deleteProductCategory: {
    params: Joi.object().keys({
      pcid: Joi.string().custom(objectId)
    })
  }
}

module.exports = productCategoryValidation