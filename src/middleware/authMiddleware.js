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
    const refreshToken = req.cookies.refreshToken
    if (refreshToken === null) return res.status(401).json({ status: false, message: 'Invalid request' })
    try {
      const decodeJwt = jwt.verify(refreshToken, config.jwt.secret)
      // verify if token is cookie or not
      redisClient.get(decodeJwt.sub, (err, data) => {
        if (err) throw new Error(err)

        if (data === null) return res.status(401).json({ status: false, message: 'Invalid request. Token is not invalid' })
        if (JSON.parse(data).token != refreshToken) return res.status(401).json({ status: false, message: 'Invalid request. Token is not correct data' })
        next()
      })
    } catch (error) {
      return res.status(401).json({
        status: false, message: 'Your token is not valid', data: error
      })
    }
  })

}

module.exports = authMiddleware