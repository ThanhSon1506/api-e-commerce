/* eslint-disable no-console */
import mongoose from 'mongoose'
import config from './config'
import logger from './logger'
mongoose.set('strictQuery', false)
const dbConnect = async () => {
  try {
    await mongoose
      .connect(config.mongoose.url, config.mongoose.options)
      .then(() => logger.info('Database connected!'))
      .catch(err => console.log(err))
  } catch (error) {
    console.log('DB connected is failed')
    throw new Error(error)
  }
}
// mongodb

module.exports = dbConnect