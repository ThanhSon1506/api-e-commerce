import redis from 'redis'
import dotenv from 'dotenv'
import config from './config'
import logger from './logger'
dotenv.config()

// const redisURL = process.env.REDIS_URL;
const redisURL = `redis://default:${config.redis.pass}@${config.redis.uri}:${config.redis.port}`
const redisClient = redis.createClient({ url: redisURL });
(async () => {
  await redisClient.ping(function (err, result) {
    logger.info(result)
  })

  await redisClient.on('connect', () => {
    logger.info('redis client connected')
  })
  await redisClient.on('error', (error) => {
    logger.info(error)
  })

})()

module.exports = redisClient


