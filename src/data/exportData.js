const fs = require('fs')
const path = require('path')
const config = require('~/config/config')
const logger = require('~/config/logger')
const mongoose = require('mongoose')

// const zlib = require('zlib')
const modelsPath = path.join(__dirname, '..', 'models')

const exportsPath = path.join(__dirname, '..', 'exports')
if (!fs.existsSync(exportsPath)) {
  fs.mkdirSync(exportsPath)
}

(async function exportData() {
  await mongoose.connect(config.mongoose.url_local, config.mongoose.options).then(() => logger.info('Database connected!')).catch(err => logger.error(err))
  if (mongoose.connection.readyState === 1) {
    logger.info('Đã kết nối đến cơ sở dữ liệu.')
  } else {
    logger.info('Chưa kết nối đến cơ sở dữ liệu.')
  }
  try {
    const models = fs.readdirSync(modelsPath)
    for (const modelFile of models) {
      if (modelFile.endsWith('.js')) {
        const modelPath = path.join(modelsPath, modelFile)
        const Model = require(modelPath)
        const data = await Model.find({})
        const modelExportPath = path.join(exportsPath, modelFile.replace('.js', ''))
        if (!fs.existsSync(modelExportPath)) {
          fs.mkdirSync(modelExportPath)
        }
        const outputPath = path.join(modelExportPath, `${modelFile.replace('.js', '')}_data.json`)
        fs.writeFileSync(outputPath, JSON.stringify(data, null, 2))
        logger.info(`Dữ liệu từ ${modelFile.replace('.js', '')} đã được xuất thành công.`)
      }
    }
  } catch (error) {
    logger.error('Lỗi khi xuất dữ liệu:', error)
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


// module.exports = exportData

