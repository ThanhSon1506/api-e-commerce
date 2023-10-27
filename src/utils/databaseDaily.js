const fs = require('fs')
const path = require('path')
const logger = require('~/config/logger')
const zlib = require('zlib')
// Đường dẫn đến thư mục models
const modelsPath = path.join(__dirname, '..', 'models')

// Đường dẫn đến thư mục exports
const exportsPath = path.join(__dirname, '..', 'exports')
// Tạo thư mục exports nếu nó không tồn tại
if (!fs.existsSync(exportsPath)) {
  fs.mkdirSync(exportsPath)
}


// Xuất dữ liệu từ tất cả các mô hình
async function exportData() {
  try {
    const models = fs.readdirSync(modelsPath)
    // Lặp qua từng tệp trong thư mục models
    for (const modelFile of models) {
      if (modelFile.endsWith('.js')) {
        const modelPath = path.join(modelsPath, modelFile)
        const Model = require(modelPath)
        // Thực hiện truy vấn để lấy dữ liệu từ cơ sở dữ liệu
        const data = await Model.find({})
        // Tạo thư mục cho mô hình nếu nó không tồn tại
        const modelExportPath = path.join(exportsPath, modelFile.replace('.js', ''))
        if (!fs.existsSync(modelExportPath)) {
          fs.mkdirSync(modelExportPath)
        }
        // Ghi dữ liệu ra tệp JSON
        const outputPath = path.join(modelExportPath, `${modelFile.replace('.js', '')}_data.json`)
        const compressedData = zlib.gzipSync(JSON.stringify(data, null, 2))
        fs.writeFileSync(outputPath, compressedData)
        logger.info(`Dữ liệu từ ${modelFile.replace('.js', '')} đã được xuất thành công.`)
      }
    }
  } catch (error) {
    logger.error('Lỗi khi xuất dữ liệu:', error)
  }
}


module.exports = exportData

