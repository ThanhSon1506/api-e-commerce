/* eslint-disable no-console */
import mongoose from 'mongoose'
import config from './config'
import logger from './logger'

mongoose.set('strictQuery', false)

const dbConnect = async () => {
  try {
    await mongoose
      .connect(config.mongoose.url, config.mongoose.options)
      .then(() => logger.info('Kết nối cơ sở dữ liệu thành công!'))
      .catch((err) => console.log(err))
  } catch (error) {
    console.log('Kết nối cơ sở dữ liệu thất bại')
    throw new Error(error)
  }
}

// mongodb

export default dbConnect
