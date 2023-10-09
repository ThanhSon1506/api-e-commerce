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
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode
    return res.status(statusCode).json({
      success: false,
      message: err?.message,
      stack: err?.stack
    })
  }
}


module.exports = ErrorHandler