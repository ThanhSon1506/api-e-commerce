const cron = require('node-cron')
const deleteOldLogs = require('~/utils/deleteOldLogs')
const path = require('path')
const moment = require('moment-timezone')
const logger = require('~/config/logger')
// const exportData = require('./databaseDaily')
moment.tz.setDefault('Asia/Ho_Chi_Minh')

cron.schedule('0 12 * * *', () => {
  const logsDirectory = path.join(__dirname, '..', 'logs') // Điều chỉnh đường dẫn logs của bạn nếu cần thiết
  deleteOldLogs(logsDirectory)
  logger.info('Logs cleaned up.')
})

