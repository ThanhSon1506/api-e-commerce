const Joi = require('@hapi/joi')
const { password } = require('./custom.validation')

const authValidation ={
  register :{
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
  }
  ,
  login :{
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
        'any.required': 'Mật khẩu là trường bắt buộc'
      })
    })
  }
  ,
  forgotPassword :{
    body: Joi.object().keys({
      email: Joi.string().required().email().messages({
        'string.base':'Email phải là một chuỗi',
        'string.empty': 'Email không được để trống',
        'string.email': 'Email không hợp lệ',
        'any.required': 'Email là trường bắt buộc'
      })
    })
  }
  ,
  resetPassword :{
    query: Joi.object().keys({
      token: Joi.string().required().messages({
        'string.base':'Token phải là một chuỗi',
        'string.empty': 'Token không được để trống',
        'any.required': 'Token là trường bắt buộc'
      })
    }),
    body: Joi.object().keys({
      password: Joi.string().required().custom(password).messages({
        'string.base': 'Mật khẩu phải là một chuỗi',
        'string.empty': 'Mật khẩu không được để trống',
        'any.required': 'Mật khẩu là trường bắt buộc'
      })
    })
  }

}

module.exports = authValidation