const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const multer = require('multer')
const config = require('./config')

cloudinary.config(config.cloudinary)
const storage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ['jpg', 'png'],
  params:{
    folder:'e-commerce'
  }
})

const uploadCloud = multer({ storage })

module.exports = uploadCloud
