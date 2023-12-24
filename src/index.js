import app from './app.js'
import config from './config/config.js'
import logger from './config/logger.js'

let server

app.listen(config.port, () => {
  logger.info(`Server is running on the port http://${config.host}:${config.port}/v1/docs`)
})
// server = app.listen(config.port, () => {
//   logger.info(`Server is running on the port http://${config.host}:${config.port}/v1/docs`)
// })

// const exitHandler = () => {
//   if (server) {
//     server.close(() => {
//       logger.info('Server closed')
//       process.exit(1)
//     })
//   } else {
//     process.exit(1)
//   }
// }

const unexpectedErrorHandler = (error) => {
  logger.error(error)
  // exitHandler()
}

process.on('uncaughtException', unexpectedErrorHandler)
process.on('unhandledRejection', unexpectedErrorHandler)

process.on('SIGTERM', () => {
  logger.info('SIGTERM received')
  // if (server) {
  //   server.close()
  // }
})
