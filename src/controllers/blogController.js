const expressAsyncHandler = require('express-async-handler')
const { blogService } = require('~/services')
const pick = require('~/utils/pick')

const BlogController = {
  createBlog: expressAsyncHandler(async (req, res) => {
    const response = await blogService.createBlog(req.body)
    return res.status(200).json({
      success: response ? true : false,
      blog: response ? response : 'Cannot create new blog'
    })
  }),
  updateBlog: expressAsyncHandler(async (req, res) => {
    const { bid } = req.params
    const updateBlog = await blogService.updateProductById(bid, req.body)
    return res.status(200).json({
      success: updateBlog ? true : false,
      updateBlog: updateBlog ? updateBlog : 'Cannot update blog'
    })
  }),
  getBlog: expressAsyncHandler(async (req, res) => {
    const { bid } = req.params
    const blog = await blogService.getBlogById(bid)
    return res.status(200).json({
      success: blog ? true : false,
      productData: blog ? blog : 'Cannot get blog'
    })
  }),
  // Filtering, sorting, pagination
  getBlogs: expressAsyncHandler(async (req, res) => {
    const filter = pick(req.query, ['title', 'role', 'price'])
    const options= pick(req.query, ['sortBy', 'limit', 'page', 'fields', 'populate'])
    const result = await blogService.queryBlogs(filter, options)
    return res.status(200).json({
      success:result?true:false,
      productData:result ? result :'Cannot get blog'
    })
  }),
  deleteBlog: expressAsyncHandler(async (req, res) => {
    const { bid } = req.params
    const deleteBlog = await blogService.deleteBlogById(bid)
    return res.status(200).json({
      success: deleteBlog ? true : false,
      deleteBlog: deleteBlog ? deleteBlog : 'Cannot delete blog'
    })
  }),
  likeBlog: expressAsyncHandler(async(req, res) => {
    const { sub:userId } = req.user
    const { bid:blogId } =req.body
    const response = blogService.likeBlog(userId, blogId)
    return res.status(200).json({
      success: response ? true : false,
      likeBlog: response ? response : 'Cannot delete blog'
    })
  })

}

module.exports = BlogController
