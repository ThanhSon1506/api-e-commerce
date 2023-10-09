import redis from 'redis'
import dotenv from 'dotenv'
dotenv.config()

// const redisURL = process.env.REDIS_URL;
const redisURL = `redis://default:${process.env.REDIS_PASSWORD}@${process.env.REDIS_URI}:${process.env.REDIS_PORT}`
const redisClient = redis.createClient({ url: redisURL });
(async () => {
  await redisClient.ping(function (err, result) {
    // eslint-disable-next-line no-console
    console.log(result)
  })

  await redisClient.on('connect', () => {
    // eslint-disable-next-line no-console
    console.log('redis client connected')
  })
  await redisClient.on('error', (error) => {
    // eslint-disable-next-line no-console
    console.log(error)
  })

})()

module.exports = redisClient


