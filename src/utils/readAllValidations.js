const glob = require('glob')
const path = require('path')
const logger = require('~/config/logger')

const validationFolderPath = './src/validations'

const readAllValidations = () => {
  const validationObjects = {}

  try {
    // Sử dụng glob để lấy danh sách các file validation
    const validationFiles = glob.sync(`${validationFolderPath}/**/*.js`)
    // Lặp qua từng file và đọc nội dung
    validationFiles.forEach((filePath) => {
      const validationName = path.parse(filePath).name

      // Đọc nội dung của file và parse nó thành đối tượng
      const validationContent = require(path.resolve(filePath))
      validationObjects[validationName] = validationContent
    })
  } catch (error) {
    logger.error('Error reading validation files:', error)
  }

  return validationObjects
}

// Sử dụng hàm để đọc tất cả các file validation
const validationObjects = readAllValidations()

module.exports = validationObjects
