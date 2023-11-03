const expressAsyncHandler = require('express-async-handler')
const { default: slugify } = require('slugify')
import httpStatus from 'http-status'
import Brand from '~/models/Brand'
import ApiError from '~/utils/ApiError'
const brandService ={
  /**
 * Create brand
 * @param {string} brandBody
 * @returns {Promise<Blog>}
 */
  createBrand : expressAsyncHandler ( async (brandBody) => {
    if (brandBody.title) brandBody.slug = slugify(brandBody.title, { locale:'vi' })
    return Brand.create(brandBody)
  }),
  /**
 * Get brand
 * @returns {Promise<Blog>}
 */
  getBrand:expressAsyncHandler(async(bid) => {
    return await Brand.findById(bid)
  }),
  /**
 * Update brand
 * @param {string} bid
 * @param {Object} brandBody
 * @returns {Promise<Blog>}
 */
  updateBrand:expressAsyncHandler(async (bid, updateBody) => {
    const brand = await Brand.findById(bid)
    if (updateBody.title)
      updateBody.slug=slugify(updateBody.title, { locale:'vi' })
    if (!brand) {
      throw new ApiError(httpStatus.NOT_FOUND, 'blog category is not found')
    }
    Object.assign(brand, updateBody)
    await brand.save()
    return brand
  }),
  /**
 * Delete brand
 * @param {string} bid
 * @returns {Promise<Blog>}
 */
  deleteBrand:expressAsyncHandler(async(bid) => {
    return Brand.findByIdAndDelete(bid)
  }),
  /**
 * Query for brand
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
  queryBrand : async (filter, options) => {
    return await Brand.paginate(filter, options)
  }
}

module.exports = brandService