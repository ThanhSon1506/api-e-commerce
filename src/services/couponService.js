const expressAsyncHandler = require('express-async-handler')
const httpStatus = require('http-status')
const { default: slugify } = require('slugify')
const Coupon = require('~/models/Coupon')
const ApiError = require('~/utils/ApiError')

const couponService = {
  /**
 * Create coupon
 * @param {string} couponBody
 * @returns {Promise<Coupon>}
 */
  createCoupon : expressAsyncHandler ( async (couponBody) => {
    console.log(couponBody)
    if (couponBody.title) couponBody.slug = slugify(couponBody.title, { locale:'vi' })
    couponBody.expiry = Date.now() + couponBody.expiry*24*60*60*1000
    return Coupon.create(couponBody)
  }),
  /**
 * Get coupon
 * @returns {Promise<Coupon>}
 */
  getCoupon : expressAsyncHandler(async(bid) => {
    return await Coupon.findById(bid)
  }),
  /**
 * Update coupon
 * @param {string} bid
 * @param {Object} couponBody
 * @returns {Promise<Coupon>}
 */
  updateCoupon:expressAsyncHandler(async (bid, updateBody) => {
    const coupon = await Coupon.findById(bid)
    if (updateBody.title)
      updateBody.slug=slugify(updateBody.title, { locale:'vi' })
    if (!coupon) {
      throw new ApiError(httpStatus.NOT_FOUND, 'coupon is not found')
    }
    Object.assign(coupon, updateBody)
    await coupon.save()
    return coupon
  }),
  /**
 * Delete brand
 * @param {string} bid
 * @returns {Promise<Coupon>}
 */
  deleteCoupon:expressAsyncHandler(async(bid) => {
    return Coupon.findByIdAndDelete(bid)
  }),
  /**
 * Query for coupon
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
  queryCoupon :expressAsyncHandler(async (filter, options) => {
    return await Coupon.paginate(filter, options)
  })
}
module.exports = couponService