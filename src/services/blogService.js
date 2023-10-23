import expressAsyncHandler from 'express-async-handler'
import slugify from 'slugify'
import Blog from '~/models/Blog'

const blogService = {
  /**
 * Create product categories
 * @param {string} blogBody
 * @returns {Promise<Product>}
 */
  createProductCategories : expressAsyncHandler ( async (blogBody) => {
    if (blogBody.title) blogBody.slug = slugify(blogBody.title, { locale:'vi' })
    return Blog.create(blogBody)
  })
}

module.exports = blogService