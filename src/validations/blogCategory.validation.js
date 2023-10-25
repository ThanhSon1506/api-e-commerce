const Joi = require('@hapi/joi')
const { objectId } = require('./custom.validation')

const blogCategoryValidation = {
  createBlogCategory: {
    body: Joi.object().keys({
      title: Joi.string().required().messages({
        'string.base': 'Title phải là một chuỗi',
        'string.empty': 'Title không được để trống',
        'any.required': 'Title là trường bắt buộc'
      })
    })
  },
  getBlogCategories: {
    query: Joi.object().keys({
      title: Joi.string(),
      role: Joi.string(),
      sortBy: Joi.string(),
      limit: Joi.number().integer(),
      page: Joi.number().integer()
    })
  },
  getBlogCategory: {
    params: Joi.object().keys({
      categoryId: Joi.string().custom(objectId)
    })
  },
  updateBlogCategory: {
    params: Joi.object().keys({
      categoryId: Joi.required().custom(objectId)
    }),
    body: Joi.object().keys({
      title: Joi.string().required().messages({
        'string.base': 'Title phải là một chuỗi',
        'string.empty': 'Title không được để trống',
        'any.required': 'Title là trường bắt buộc'
      })
    })
  },
  deleteBlogCategory: {
    params: Joi.object().keys({
      categoryId: Joi.string().custom(objectId)
    })
  }
}

module.exports = blogCategoryValidation
