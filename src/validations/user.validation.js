const Joi = require('@hapi/joi')
const { password, objectId } = require('./custom.validation')

const userValidation ={
  createUser :  {
    body: Joi.object().keys({
      email: Joi.string().required().email().messages({
        'string.base':'Email phải là một chuỗi',
        'string.empty': 'Email không được để trống',
        'string.email': 'Email không hợp lệ',
        'any.required': 'Email là trường bắt buộc'
      }),
      password: Joi.string().required().custom(password).messages({
        'string.base': 'Mật khẩu phải là một chuỗi',
        'string.empty': 'Mật khẩu không được để trống',
        'any.required': 'Mật khẩu là trường bắt buộc',
        'custom': 'Mật khẩu phải gồm 8 ký tự'
      }),
      firstName: Joi.string().required().messages({
        'string.base': 'FirstName phải là một chuỗi',
        'string.empty': 'FirstName không được để trống',
        'any.required': 'FirstName là trường bắt buộc'
      }),
      lastName: Joi.string().required().messages({
        'string.base': 'LastName phải là một chuỗi',
        'string.empty': 'LastName không được để trống',
        'any.required': 'LastName là trường bắt buộc'
      }),
      mobile:Joi.string().required().messages({
        'string.base': 'Mobile phải là một chuỗi',
        'string.empty': 'Mobile không được để trống',
        'any.required': 'Mobile là trường bắt buộc'
      })
    })
  },
  getUsers : {
    query: Joi.object().keys({
      name: Joi.string(),
      role: Joi.string(),
      sortBy: Joi.string(),
      limit: Joi.number().integer(),
      page: Joi.number().integer()
    })
  },
  getUser : {
    params: Joi.object().keys({
      userId: Joi.string().custom(objectId)
    })
  },
  updateUser : {
    params: Joi.object().keys({
      userId: Joi.required().custom(objectId)
    }),
    body: Joi.object()
      .keys({
        email: Joi.string().email(),
        password: Joi.string().custom(password),
        firstName: Joi.string(),
        lastName:Joi.string()
      })
      .min(1)
  },
  deleteUser : {
    params: Joi.object().keys({
      userId: Joi.string().custom(objectId)
    })
  }
}

module.exports=userValidation