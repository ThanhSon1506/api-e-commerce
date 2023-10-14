const expressAsyncHandler = require('express-async-handler')
import Product from '~/models/Product'
import slugify from 'slugify'
const productService = {
  /**
 * Create uer
 * @param {string} productBody
 * @returns {Promise<Product>}
 */
  createProduct : expressAsyncHandler( async (productBody) => {
    if (productBody.title) productBody.slug = slugify(productBody.title, { locale:'vi' })
    return Product.create(productBody)
  }),
  /**
 * Get info product by id
 * @param {string} pid
 * @returns {Promise<Product>}
 */
  getProductById: expressAsyncHandler(async (pid) => {
    return Product.findById(pid)
  }),
  /**
 * Query for Products
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
  queryProducts : async (filter, options) => {
    const Products = await Product.paginate(filter, options)
    return Products
  }
}
module.exports= productService