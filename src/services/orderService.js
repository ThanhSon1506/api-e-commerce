const expressAsyncHandler = require('express-async-handler')
import Coupon from '~/models/Coupon'
import Order from '~/models/Order'
import User from '~/models/User.js'

const orderService={
  createOrder:expressAsyncHandler(async(userId, productBody) => {
    const userObject = await User.findById(userId).select('cart').populate('cart.product', 'title price')
    const { coupon:couponId } = productBody
    const products = userObject.cart?.map(element => ({
      product:element.product._id,
      count:element.quantity,
      color:element.color
    }))
    let total = userObject.cart.reduce((sum, element) => element.product.price * element.quantity + sum, 0)
    const objectData = { products, total, orderBy:userId }
    if (couponId) {
      const couponObject = await Coupon.findById(couponId)
      total = Math.round(total*(1-+couponObject.discount/100)/1000)*1000 || total
      objectData.total = total
      objectData.coupon = couponId
    }
    const orderObject = await Order.create(objectData)
    return { orderObject, userObject }
  }),
  updateStatusOrder: expressAsyncHandler(async(orderId, orderBody) => {
    const { status } = orderBody
    const orderObject = await Order.findByIdAndUpdate(orderId, { status }, { new:true })
    return orderObject
  }),
  getOrder:expressAsyncHandler(async(orderId) => {
    return await Order.findById(orderId)
  }),
  /**
 * Query for Orders
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
  queryOrders : async (filter, options) => {
    const Orders = await Order.paginate(filter, options)
    return Orders
  }
}
module.exports = orderService