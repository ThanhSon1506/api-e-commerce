const Joi = require('@hapi/joi')
const { objectId } = require('./custom.validation')

const brandValidation = {
  createBrand: {
    body: Joi.object().keys({
      title: Joi.string().required().messages({
        'string.base': 'Title phải là một chuỗi',
        'string.empty': 'Title không được để trống',
        'any.required': 'Title là trường bắt buộc'
      })
    })
  },
  getBrands: {
    query: Joi.object().keys({
      title: Joi.string(),
      role: Joi.string(),
      sortBy: Joi.string(),
      limit: Joi.number().integer(),
      page: Joi.number().integer(),
      select:Joi.string()
    })
  },
  getBrand: {
    params: Joi.object().keys({
      bid: Joi.string().custom(objectId)
    })
  },
  updateBrand: {
    params: Joi.object().keys({
      bid: Joi.required().custom(objectId)
    }),
    body: Joi.object().keys({
      title: Joi.string().required().messages({
        'string.base': 'Title phải là một chuỗi',
        'string.empty': 'Title không được để trống',
        'any.required': 'Title là trường bắt buộc'
      })
    })
  },
  deleteBrand: {
    params: Joi.object().keys({
      bid: Joi.string().custom(objectId)
    })
  }
}

module.exports = brandValidation
