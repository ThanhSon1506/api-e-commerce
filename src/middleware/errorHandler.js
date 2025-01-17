// const logger = require('~/config/logger')

const language = {
  vi: {
    ERROR10001: 'Server error',
    ERROR10002: 'Please enter'
  },
  en: {
    ERROR10001: 'Server is error'
  }
}
// not found
const ErrorHandler = {
  notFound: (req, res, next) => {
    const error = new Error(`Not Found: ${req.originalUrl}`)
    res.status(404)
    next(error)
  },

  // Error Handler
  // eslint-disable-next-line no-unused-vars
  errorHandler: (err, req, res, next) => {


    if (err) {
      return res.status(err?.statusCode || 500).json({
        success: false,
        message: err?.message || 'Đã có lỗi xảy ra, vui lòng thử lại sau'
        // message: err?.message
        // stack: err?.stack
      })
    }

    return res.status(res?.statusCode === 200 ? 500 : res?.statusCode).json({
      success: false,
      message:
        err?.errors?.map((err) => {
          let field = err.split(':')[0]
          let code = err.split(':')[1]
          return field + ' ' + language[req.query.language][code]
        }) || err?.message || 'Đã có lỗi xảy ra, vui lòng thử lại sau'
      // message: err?.message
      // stack: err?.stack
    })

  }
}

module.exports = ErrorHandler
