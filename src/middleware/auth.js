const jwt = require('jsonwebtoken')
const httpStatus = require('http-status')
const ApiError = require('../utils/ApiError')
const { roleRights } = require('../config/roles')
const config = require('~/config/config')

const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.jwt.secret, (err, decoded) => {
      if (err) {
        reject(err)
      } else {
        resolve(decoded)
      }
    })
  })
}

const auth = (...requiredRights) => async (req, res, next) => {
  try {
    const token = req.headers.authorization
     && req.headers.authorization.split(' ')[1]
    if (!token) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Hãy cung cấp giá trị token')
    }
    const decodedToken = await verifyToken(token)
    req.user = decodedToken
    if (requiredRights.length) {
      const userRights = roleRights.get(decodedToken.role)
      const hasRequiredRights = requiredRights.every((requiredRight) =>
        userRights.includes(requiredRight)
      )
      if (!hasRequiredRights && req.params.userId !== decodedToken.sub) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Bạn ko đủ quyền để thực hiện chức năng này')
      }
    }

    next()
  } catch (error) {
    next(new ApiError(httpStatus.UNAUTHORIZED, error))
  }
}

module.exports = auth
