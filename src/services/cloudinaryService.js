const expressAsyncHandler = require('express-async-handler')
import Product from '~/models/Product'
import Blog from '~/models/Blog'
import logger from '~/config/logger'
import { cloudinary } from '~/config/cloudinary.config'


const cloudinaryService = {
  uploadImagesProduct : expressAsyncHandler(async (files, productId) => {
    const response = await Product.findByIdAndUpdate(productId, { $push:{ images:{ $each:files.map(element => element.path) } } }, { new:true })
    return response
  }),
  uploadImageBlog: expressAsyncHandler(async(file, blogId) => {
    const response = await Blog.findByIdAndUpdate(blogId, { image:file.path }, { new:true })
    return response
  }),
  uploadToCloudinary:expressAsyncHandler(async(imagePath) => {
    try {
      const result = await cloudinary.uploader.upload(imagePath)
      return result.secure_url
    } catch (error) {
      logger.error('Lỗi khi tải lên Cloudinary:', error.message)
      throw error
    }
  })
}

module.exports = cloudinaryService