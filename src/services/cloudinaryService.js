const expressAsyncHandler = require('express-async-handler')
import Product from '~/models/Product'
import Blog from '~/models/Blog'


const cloudinaryService = {
  uploadImagesProduct : expressAsyncHandler(async (files, productId) => {
    const response = await Product.findByIdAndUpdate(productId, { $push:{ images:{ $each:files.map(element => element.path) } } }, { new:true })
    return response
  }),
  uploadImageBlog: expressAsyncHandler(async(file, blogId) => {
    const response = await Blog.findByIdAndUpdate(blogId, { image:file.path }, { new:true })
    return response
  })
}

module.exports = cloudinaryService