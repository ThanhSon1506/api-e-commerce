const expressAsyncHandler = require('express-async-handler')
import Product from '~/models/Product'
import slugify from 'slugify'
import ApiError from '~/utils/ApiError'
import httpStatus from 'http-status'
const productService = {
  /**
 * Create product
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
  },

  /**
 * Update Product by id
 * @param {ObjectId} productId
 * @param {Object} updateBody
 * @returns {Promise<Product>}
 */
  updateProductById : async (productId, updateBody) => {
    if (updateBody.title) updateBody.slug=slugify(updateBody.title, { locale:'vi' })
    const product = await productService.getProductById(productId)
    if (!product) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Product not found')
    }
    Object.assign(product, updateBody)
    await product.save()
    return product
  },
  deleteProductById:async(productId) => {
    return Product.findByIdAndDelete(productId)
  },
  ratingProduct: async (userId, productBody) => {
    const { star, comment, pid } = productBody
    if (!star || !pid) throw new Error('Missing inputs')
    const ratingProduct = await Product.findById(pid)
    const alreadyRating = ratingProduct?.ratings
      ?.find(element => element?.posteBy.toString() === userId)

    if (alreadyRating) {
      // update star and comment
      await Product.updateOne({
        ratings: { $elemMatch: alreadyRating }
      }, {
        $set: {
          'ratings.$.star': star,
          'ratings.$.comment': comment
        }
      }, { new: true })
    } else {
      // add star and comment
      await Product.findByIdAndUpdate(pid, {
        $push: { ratings: { star, comment, posteBy:userId } }
      }, { new: true })
    }
    const updateProduct = await Product.findById(pid)
    const ratingCount = updateProduct.ratings.length
    const sumRatings = updateProduct.ratings.reduce((sum, element) => sum + +element.star, 0)
    updateProduct.totalRating = Math.round(sumRatings * 10 / ratingCount) / 10
    await updateProduct.save()
    return updateProduct
  }
}
module.exports= productService