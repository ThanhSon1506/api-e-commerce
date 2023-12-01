const Yup = require('yup')
const { password } = require('./custom.validation')
const authValidation ={
  login :{
    body: Yup.object().keys({
      email: Yup.string().required().email(),
      password: Yup.string().required().custom(password)
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