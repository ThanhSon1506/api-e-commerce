const winston = require('winston')
const { Writable } = require('stream')
// const http = require('http')
const config = require('./config')
const path = require('path')
require('winston-daily-rotate-file')
const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack })
  }
  return info
})
const stream = new Writable({
  objectMode: false,
  // eslint-disable-next-line no-console
  write: raw => console.log('stream ', raw.toString())
})
// http
//   .createServer((req, res) => {
//     const arr = []
//     req
//       .on('data', chunk => arr.push(chunk))
//       .on('end', () => {
//         const msg = Buffer.concat(arr).toString()
//         // eslint-disable-next-line no-console
//         console.log('http msg', msg)
//         res.end(msg)
//       })
//   })
//   .listen(4000)

const logger = winston.createLogger({
  level: config.env === 'development' ? 'debug' : 'info',
  format: winston.format.combine(
    enumerateErrorFormat(),
    config.env === 'development' ? winston.format.colorize() : winston.format.uncolorize(),
    winston.format.splat(),
    winston.format.printf(({ level, message }) => `${level}: ${message}`)
  ),
  transports: [
    new winston.transports.Console({
      stderrLevels: ['error']
    }),
    new winston.transports.DailyRotateFile({
      level: config.env === 'development' ? 'debug' : 'info',
      format:  winston.format.printf(({ level, message } ) => `${level}: ${message}`),
      // eslint-disable-next-line quotes
      filename: path.join(__dirname, '..', 'logs', `%DATE%.log`),
      maxSize: '20m',
      maxFiles: '14d',
      datePattern: 'YYYY-MM-DD',
      prepend: true,
      json: false
    }),
    // new winston.transports.Http({ host: 'localhost', port: 4000 }),

    new winston.transports.Stream({ stream })
  ]
})

module.exports = logger