import expressAsyncHandler from 'express-async-handler'
import httpStatus from 'http-status'
import slugify from 'slugify'
import Blog from '~/models/Blog'
import ApiError from '~/utils/ApiError'

const blogService = {
  /**
 * Create Blog categories
 * @param {string} blogBody
 * @returns {Promise<Blog>}
 */
  createBlog : expressAsyncHandler ( async (blogBody) => {
    if (blogBody.title) blogBody.slug = slugify(blogBody.title, { locale:'vi' })
    return Blog.create(blogBody)
  }),
  /**
 * Get info Blog by id
 * @param {string} pid
 * @returns {Promise<Blog>}
 */
  getBlogById: expressAsyncHandler(async (bid) => {
    return Blog.findById(bid)
  }),
  /**
 * Update Blog by id
 * @param {ObjectId} blogId
 * @param {Object} updateBody
 * @returns {Promise<Blog>}
 */
  updateBlogById : async (blogId, updateBody) => {
    if (updateBody.title) updateBody.slug=slugify(updateBody.title, { locale:'vi' })
    const blog = await blogService.getBlogById(blogId)
    if (!blog) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Blog not found')
    }
    Object.assign(blog, updateBody)
    await Blog.save()
    return blog
  },
  /**
 * Query for Blogs
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
  queryBlogs : async (filter, options) => {
    const Blogs = await Blog.paginate(filter, options)
    return Blogs
  },

  /**
 * delete Blog by id
 * @param {ObjectId} blogId
 * @param {Object} deleteBody
 * @returns {Promise<Blog>}
 */
  deleteBlogById:async(blogId) => {
    return Blog.findByIdAndDelete(blogId)
  },
  /**
   * Khi người dùng like một bài blog thì:
   * 1. Check xem người đó trước có dislike hay không => bỏ đislike
   * 2. Check xem người đó trước có like hay không => bỏ like / Thêm like
   *
   * */

  /**
 * Like blog
 * @param {ObjectId} userId
 * @param {ObjectId} blogId
 * @param {Object} response
 * @returns {Promise<Blog>}
 */
  likeBlog:async(userId, blogId) => {
    const blog = await blogService.getBlogById(blogId)
    const alreadyDisliked= blog?.dislikes.find(element => element.toString() === userId)
    if (alreadyDisliked) {
      const response=await Blog.findByIdAndUpdate(blogId, { $pull: { dislikes:userId } }, { new:true })
      return response
    }
    const isLiked = blog?.likes.find(element => element.toString() === userId)
    if (isLiked) {
      const response = await Blog.findByIdAndUpdate(blogId, { $pull: { likes:userId } }, { new:true })
      return response
    } else {
      const response =await Blog.findByIdAndUpdate(blogId, { $push:{ likes:userId } }, { new:true })
      return response
    }
  },
  /**
 * Dislike blog
 * @param {ObjectId} userId
 * @param {ObjectId} blogId
 * @param {Object} response
 * @returns {Promise<Blog>}
 */
  disLikeBlog:async(userId, blogId) => {
    const blog = await blogService.getBlogById(blogId)
    const alreadyLiked= blog?.likes.find(element => element.toString() === userId)
    if (alreadyLiked) {
      const response=await Blog.findByIdAndUpdate(blogId, { $pull: { likes:userId } }, { new:true })
      return response
    }
    const isDisliked = blog?.dislikes.find(element => element.toString() === userId)
    if (isDisliked) {
      const response = await Blog.findByIdAndUpdate(blogId, { $pull: { dislikes:userId } }, { new:true })
      return response
    } else {
      const response =await Blog.findByIdAndUpdate(blogId, { $push:{ dislikes:userId } }, { new:true })
      return response
    }
  }
}

module.exports = blogService