import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import dbConnect from './config/initMongo'
import routes from './routes/v1'
import config from './config/config'
import morgan from './config/morgan'
const ErrorHandler = require('~/middleware/errorHandler')

const app = express()

const corsOptions = {
  origin: process.env.URL_CLIENT,
  credentials: true,
  optionSuccessStatus: 200, //access-control-allow-credentials:true
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}

const port = process.env.PORT || 3000


if (config.env !== 'test') {
  app.use(morgan.successHandler)
  app.use(morgan.errorHandler)
}

dotenv.config()
dbConnect()
app.use(express.json())

app.use(cors(corsOptions))
app.options('*', cors(corsOptions))
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/v1', routes)
app.use(ErrorHandler.notFound)
app.use(ErrorHandler.errorHandler)
// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Server is running on the port ${port}`))
// JSON WEB TOKEN