import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import dbConnect from '~/config/initMongo'
import routes from '~/routes/v1'
import config from '~/config/config'
import morgan from '~/config/morgan'
import mongoSanitize from 'express-mongo-sanitize'
import ErrorHandler from '~/middleware/errorHandler'
import compression from 'compression'
import helmet from 'helmet'
import xss from 'xss-clean'
import { apiLimiter, authLimiter } from '~/middleware/rateLimiter'
import ApiError from './utils/ApiError'
import httpStatus from 'http-status'
require('./utils/cleanupLogsJob')
require('./data/backupData')
const app = express()
const corsOptions = {
  origin:'*',
  credentials: true,
  optionSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}
dotenv.config()
dbConnect()

app.use(cors(corsOptions))
if (config.env !== 'test') {
  app.use(morgan.successHandler)
  app.use(morgan.errorHandler)
}
app.use(mongoSanitize())
app.use(compression())
app.use(helmet())
app.use(xss())

app.use(express.json())
app.options('*', cors(corsOptions))
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))

if (config.env === 'production') {
  app.use('/v1', apiLimiter)
  app.use('/v1/auth', authLimiter)
}

app.use('/v1', routes)

app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'))
})

app.use(ErrorHandler.notFound)
app.use(ErrorHandler.errorHandler)

module.exports = app