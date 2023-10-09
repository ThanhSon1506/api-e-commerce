const expressAsyncHandler = require('express-async-handler')
const Blog = require('~/models/Blog')

const BlogController = {
  createBlog: expressAsyncHandler(async (req, res) => {
    // const { title, description, category } = req.body
    const response = await Blog.create(req.body)
    return res.status(200).json({
      success: response ? true : false,
      createdBlog: response ? response : 'Cannot create new blog-category'
    })
  })

}

module.exports = BlogController
