const redis = require('redis');
const dotenv = require('dotenv');
dotenv.config();

// const redisURL = process.env.REDIS_URL;
const redisURL = `redis://default:${process.env.REDIS_PASSWORD}@${process.env.REDIS_URI}:${process.env.REDIS_PORT}`;
const redisClient = redis.createClient({ url: redisURL });
(async () => {
    await redisClient.ping(function (err, result) {
        console.log(result);
    });

    await redisClient.on('connect', (data) => {
        console.log('redis client connected');
    });
    await redisClient.on('error', (error) => {
        console.log(error);
    });

})()

module.exports = redisClient;


