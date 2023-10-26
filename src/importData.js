const fs = require('fs')
const path = require('path')
const zlib = require('zlib')
const logger = require('./config/logger')

// Đường dẫn đến thư mục models
const modelsPath = path.join(__dirname, '..', 'models')

// Đường dẫn đến thư mục exports
const exportsPath = path.join(__dirname, '..', 'exports')
// Tạo thư mục exports nếu nó không tồn tại
if (!fs.existsSync(exportsPath)) {
  fs.mkdirSync(exportsPath)
}
// Lấy danh sách tất cả các thư mục trong thư mục exports
const exportFolders = fs.readdirSync(exportsPath)

// Hàm giải nén dữ liệu từ tệp đã nén
function decompressData(compressedData) {
  return zlib.gunzipSync(compressedData).toString('utf-8')
}

// Import dữ liệu từ mỗi mô hình
async function importData() {
  try {
    // Lặp qua từng thư mục trong thư mục exports
    for (const exportFolder of exportFolders) {
      const folderPath = path.join(exportsPath, exportFolder)
      const dataFiles = fs.readdirSync(folderPath)

      // Lặp qua từng tệp JSON trong thư mục
      for (const dataFile of dataFiles) {
        if (dataFile.endsWith('_data.json')) {
          const modelName = dataFile.replace('_data.json', '')
          const modelPath = path.join(modelsPath, `${modelName}.js`)

          // Kiểm tra xem mô hình có tồn tại không
          if (fs.existsSync(modelPath)) {
            // Import mô hình
            const Model = require(modelPath)

            // Đọc dữ liệu từ tệp JSON
            const dataPath = path.join(folderPath, dataFile)
            const rawData = fs.readFileSync(dataPath)

            // Kiểm tra xem dữ liệu đã nén chưa
            const jsonData = dataFile.endsWith('.gz')
              ? JSON.parse(decompressData(rawData))
              : JSON.parse(rawData)

            // Xóa tất cả dữ liệu hiện có của mô hình trước khi nhập
            await Model.deleteMany({})

            // Thêm dữ liệu vào cơ sở dữ liệu
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
    logger.info('Dữ liệu đã được khôi phục thành công.')
  }
}

importData()