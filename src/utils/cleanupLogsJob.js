const cron = require('node-cron')
const { deleteOldLogs } = require('~/logs/deleteOldLogs')
const path = require('path')
// Chạy hàm xóa logs mỗi ngày lúc 2 giờ sáng
cron.schedule('0 2 * * *', () => {
  const logsDirectory = path.join(__dirname, '..', 'logs') // Điều chỉnh đường dẫn logs của bạn nếu cần thiết
  deleteOldLogs(logsDirectory)
  // eslint-disable-next-line no-console
  console.log('Logs cleaned up.')
})