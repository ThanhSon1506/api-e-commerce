const expressAsyncHandler = require('express-async-handler')
const { default: slugify } = require('slugify')
import httpStatus from 'http-status'
import BlogCategory from '~/models/BlogCategory'
import ApiError from '~/utils/ApiError'
const blogCategoryService ={
  /**
 * Create blog categories
 * @param {string} blogCategoryBody
 * @returns {Promise<Blog>}
 */
  createBlogCategories : expressAsyncHandler ( async (blogCategoryBody) => {
    if (blogCategoryBody.title) blogCategoryBody.slug = slugify(blogCategoryBody.title, { locale:'vi' })
    return BlogCategory.create(blogCategoryBody)
  }),
  /**
 * Get blog categories
 * @returns {Promise<Blog>}
 */
  getBlogCategories:expressAsyncHandler(async() => {
    return await BlogCategory.find().select('title id')
  }),
  /**
 * Update blog categories
 * @param {string} bcid
 * @param {Object} blogCategoryBody
 * @returns {Promise<Blog>}
 */
  updateBlogCategories:expressAsyncHandler(async (bcid, updateBody) => {
    const blogCategory = await BlogCategory.findById(bcid)
    if (updateBody.title)
      updateBody.slug=slugify(updateBody.title, { locale:'vi' })
    if (!blogCategory) {
      throw new ApiError(httpStatus.NOT_FOUND, 'blog category is not found')
    }
    Object.assign(blogCategory, updateBody)
    await blogCategory.save()
    return blogCategory
  }),
  /**
 * Delete blog categories
 * @param {string} bcid
 * @returns {Promise<Blog>}
 */
  deleteBlogCategory:expressAsyncHandler(async(bcid) => {
    return BlogCategory.findByIdAndDelete(bcid)
  }),
  /**
 * Query for blog Categories
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
  queryBlogCategories : async (filter, options) => {
    const BlogCategories = await BlogCategory.paginate(filter, options)
    return BlogCategories
  }
}

module.exports = blogCategoryService