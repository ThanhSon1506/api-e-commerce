import jwt from 'jsonwebtoken'
import redisClient from '~/config/initRedis'
import expressAsyncHandler from 'express-async-handler'
import config from '~/config/config'

const authMiddleware = {
  // verifyToken
  verifyToken: expressAsyncHandler((req, res, next) => {
    const token = req.headers.authorization
    if (token) {
      const accessToken = token.split(' ')[1]
      jwt.verify(accessToken, config.jwt.secret, (err, user) => {
        if (err) {
          return res.status(403).json({
            success: false,
            message: 'Token is not valid',
            stack: err
          })
        }
        req.user = user
        // verify blacklisted access token
        next()
      })
    }
    else {
      return res.status(401).json({ success: false, message: 'You\'re not authenticated' })
    }
  }),
  verifyAdminAuth: expressAsyncHandler((req, res, next) => {
    const { role } = req.user
    if (role !== 'admin')
      return res.status(401).json({
        success: false,
        message: 'Required admin role'
      })
    next()
    // authMiddleware.verifyToken(req, res, () => {
    // });
  }),
  verifyRefreshToken: expressAsyncHandler((req, res, next) => {
    const refreshToken = req.headers.authorization?.split('Bearer ')[1]
    if (!refreshToken) return res.status(401).json({ success: false, message: 'Your token is not valid' })
    try {
      const decodeJwt = jwt.verify(refreshToken, config.jwt.secret)
      if (!decodeJwt) return res.status(401).json({ success: false, message: 'Your token is not valid' })
      next()
    } catch (error) {
      return res.status(401).json({
        success: false, message: 'Your token is not valid'
      })
    }
  })

}

module.exports = authMiddleware