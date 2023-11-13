const fs = require('fs')
const path = require('path')
const zlib = require('zlib')
const logger = require('~/config/logger')
const mongoose = require('mongoose')
const config = require('~/config/config')


const modelsPath = path.join(__dirname, '..', 'models')

const exportsPath = path.join(__dirname, '..', 'exports')
if (!fs.existsSync(exportsPath)) {
  fs.mkdirSync(exportsPath)
}
const exportFolders = fs.readdirSync(exportsPath)

function decompressData(compressedData) {
  return zlib.gunzipSync(compressedData).toString('utf-8')
}

(async function importData() {
  await mongoose.connect(config.mongoose.url_local, config.mongoose.options).then(() => logger.info('Database connected!')).catch(err => logger.error(err))
  if (mongoose.connection.readyState === 1) {
    logger.info('Đã kết nối đến cơ sở dữ liệu.')
  } else {
    logger.info('Chưa kết nối đến cơ sở dữ liệu.')
  }
  try {
    for (const exportFolder of exportFolders) {
      const folderPath = path.join(exportsPath, exportFolder)
      const dataFiles = fs.readdirSync(folderPath)

      for (const dataFile of dataFiles) {
        if (dataFile.endsWith('_data.json')) {
          const modelName = dataFile.replace('_data.json', '')
          const modelPath = path.join(modelsPath, `${modelName}.js`)

          if (fs.existsSync(modelPath)) {
            const Model = require(modelPath)

            const dataPath = path.join(folderPath, dataFile)
            const rawData = fs.readFileSync(dataPath)

            const jsonData = dataFile.endsWith('.gz')
              ? JSON.parse(decompressData(rawData))
              : JSON.parse(rawData)
            await Model.deleteMany({})

            await Model.insertMany(jsonData)

            logger.info(`Dữ liệu từ ${dataFile} đã được nhập thành công.`)
          } else {
            logger.error(`Không tìm thấy mô hình cho ${modelName}.`)
          }
        }
      }
    }
  } catch (error) {
    logger.error('Lỗi khi nhập dữ liệu:', error)
  } finally {
    mongoose.connection.close()
      .then(() => {
        logger.info('Đã đóng kết nối đến cơ sở dữ liệu.')
      })
      .catch((error) => {
        logger.error('Lỗi khi đóng kết nối đến cơ sở dữ liệu:', error)
      })
  }
})()