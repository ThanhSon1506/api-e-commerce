const app = require('./app')
const config = require('./config/config')
const logger = require('./config/logger')

let server

server = app.listen(config.port, () => {
  logger.info(`Server is running on the port http://${config.host}:${config.port}/admin/v1/docs`)
})


const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed')
      process.exit(1)
    })
  } else {
    process.exit(1)
  }
}

const unexpectedErrorHandler = (error) => {
  logger.error(error)
  exitHandler()
}

process.on('uncaughtException', unexpectedErrorHandler)
process.on('unhandledRejection', unexpectedErrorHandler)

process.on('SIGTERM', () => {
  logger.info('SIGTERM received')
  if (server) {
    server.close()
  }
})