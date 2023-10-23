const rateLimit = require('express-rate-limit')
const httpStatus = require('http-status')

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(httpStatus.TOO_MANY_REQUESTS).json({
      message: 'Bạn gửi quá nhiều yêu cầu, vui lòng thử lại sau 1 giờ.'
    })
  }
})

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 200,
  skipSuccessfulRequests: true,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(httpStatus.TOO_MANY_REQUESTS).json({
      message: 'Bạn gửi quá nhiều yêu cầu, vui lòng thử lại sau 15 phút.'
    })
  }
})

module.exports = {
  authLimiter,
  apiLimiter
}