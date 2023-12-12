import logger from '~/config/logger'

const fs = require('fs')
const path = require('path')
const rimraf = require('rimraf')
const exportsPath = path.join(__dirname, '..', 'exports')
function clearModels(models) {
  models.forEach(modelName => {
    const modelExportPath = path.join(exportsPath, modelName)

    // Kiểm tra xem thư mục của model có tồn tại không
    if (fs.existsSync(modelExportPath)) {
      // Xóa thư mục của model
      rimraf.sync(modelExportPath)
      logger.info(`Dữ liệu của model "${modelName}" đã được xóa.`)
    } else {
      logger.info(`Thư mục của model "${modelName}" không tồn tại.`)
    }
  })
}
const modelsToClear = ['Product', 'Brand', 'DetailProduct', 'ProductCategory']
clearModels(modelsToClear)