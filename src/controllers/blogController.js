const expressAsyncHandler = require('express-async-handler')
const { blogService } = require('~/services')

const BlogController = {
  createBlog: expressAsyncHandler(async (req, res) => {
    const response = await blogService.createProductCategories(req.body)
    return res.status(200).json({
      success: response ? true : false,
      createdBlog: response ? response : 'Cannot create new blog-category'
    })
  })

}

module.exports = BlogController
