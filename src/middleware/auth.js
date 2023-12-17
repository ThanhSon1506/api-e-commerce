const jwt = require('jsonwebtoken')
const httpStatus = require('http-status')
const ApiError = require('../utils/ApiError')
const { roleRights } = require('../config/roles')
const config = require('~/config/config')
import TokenModel from '~/models/Token'


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

const auth = (...roles) => async (req, res, next) => {
  try {
    if (!req.headers.authorization || !req.headers.authorization.includes('Bearer ')) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Không có quyền truy cập!')
    }

    const token = req.headers.authorization.split('Bearer ')[1]
    if (!token) throw new ApiError(httpStatus.UNAUTHORIZED, 'Không có quyền truy cập!')

    const decodedToken = await verifyToken(token)
    if (!decodedToken) throw new ApiError(httpStatus.UNAUTHORIZED, 'Không có quyền truy cập!')

    if (decodedToken.type === 'refresh') {
      let tokenModel= await TokenModel.findOne({ token: token, type: decodedToken.type }).lean()
      if (!tokenModel) throw new ApiError(httpStatus.UNAUTHORIZED, 'Không có quyền truy cập!')
    }

    req.user = decodedToken

    // kiểm tra role
    if (!roles?.length || !req.user.role.length) throw new ApiError(httpStatus.UNAUTHORIZED, 'Không có quyền truy cập!')

    // người dùng có quyên root - cao nhất
    if (req.user.role?.includes('admin')) return next()
    // người dùng có quyên root - cao nhất
    if (req.user.role?.includes('manageAdmin')) return next()

    // xử lý role
    for (const role of req.user.role) {
      if (roles.includes(role)) return next()
    }

    throw new ApiError(httpStatus.UNAUTHORIZED, 'Không có quyền truy cập!')
  } catch (error) {
    // eslint-disable-next-line no-console
    // console.warn('AuthMiddleware:auth ->', error)
    next(new ApiError(httpStatus.UNAUTHORIZED, 'Không có quyền truy cập!'))
  }
}

module.exports = auth
