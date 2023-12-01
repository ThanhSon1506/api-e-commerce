const Yup = require('yup')
const { password } = require('./custom.validation')
const authValidation ={
  login :{
    body: Yup.object().keys({
      email: Yup.string().required().email(),
      password: Yup.string().required().custom(password),
      lastName:Yup.string().required(),
      firstName:Yup.string().required()
    })
  },
  registerer :{
    body: Yup.object().keys({
      email: Yup.string().required().email(),
      password: Yup.string().required().custom(password)
    })
  }
}

module.exports = authValidation