const cron = require('node-cron')
const moment = require('moment-timezone')
// const exportData = require('./databaseDaily')
moment.tz.setDefault('Asia/Ho_Chi_Minh')

cron.schedule('0 12 * * *', () => {
  require('./exportData')
})