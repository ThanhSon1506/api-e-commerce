/* eslint-disable no-console */
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const config = require('~/config/config')
const logger = require('~/config/logger')

const readdir = promisify(fs.readdir)
const unlink = promisify(fs.unlink)

async function deleteOldLogs(logsDirectory, daysToKeep = config.days) {
  try {
    const files = await readdir(logsDirectory)

    const currentDate = new Date()
    currentDate.setDate(currentDate.getDate() - daysToKeep)

    files.forEach(async (file) => {
      const filePath = path.join(logsDirectory, file)
      const fileStat = await fs.promises.stat(filePath)

      if (fileStat.isFile() && fileStat.mtime < currentDate) {
        await unlink(filePath)
        logger.info(`Deleted old log file: ${file}`)
      }
    })
  } catch (error) {
    logger.error('Error deleting old log files:', error.message)
  }
}
module.exports = deleteOldLogs

