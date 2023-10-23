const expressAsyncHandler = require('express-async-handler')
const { default: slugify } = require('slugify')
import httpStatus from 'http-status'
import ProductCategory from '~/models/ProductCategory'
import ApiError from '~/utils/ApiError'

const productCategoryService={
  /**
 * Create product categories
 * @param {string} productCategoryBody
 * @returns {Promise<Product>}
 */
  createProductCategories : expressAsyncHandler ( async (productCategoryBody) => {
    if (productCategoryBody.title) productCategoryBody.slug = slugify(productCategoryBody.title, { locale:'vi' })
    return ProductCategory.create(productCategoryBody)
  }),
  /**
 * Get product categories
 * @returns {Promise<Product>}
 */
  getProductCategories:expressAsyncHandler(async() => {
    return await ProductCategory.find().select('title id')
  }),
  /**
 * Update product categories
 * @param {string} pcid
 * @param {Object} productCategoryBody
 * @returns {Promise<Product>}
 */
  updateProductCategories:expressAsyncHandler(async (pcid, updateBody) => {
    const productCategory = await ProductCategory.findById(pcid)
    if (updateBody.title)
      updateBody.slug=slugify(updateBody.title, { locale:'vi' })
    if (!productCategory) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Product category is not found')
    }
    Object.assign(productCategory, updateBody)
    await productCategory.save()
    return productCategory
  }),
  /**
 * Delete product categories
 * @param {string} pcid
 * @returns {Promise<Product>}
 */
  deleteProductCategory:expressAsyncHandler(async(pcid) => {
    return ProductCategory.findByIdAndDelete(pcid)
  }),
  /**
 * Query for Product Categories
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
  queryProductCategories : async (filter, options) => {
    const ProductCategories = await ProductCategory.paginate(filter, options)
    return ProductCategories
  }
}

module.exports= productCategoryService