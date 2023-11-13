const expressAsyncHandler = require('express-async-handler')
const { orderService } = require('~/services')
const pick = require('~/utils/pick')

const orderController= {
  createOrder:expressAsyncHandler(async(req, res) => {
    const { sub:userId } = req.user
    const response = await orderService.createOrder(userId, req.body)
    return res.status(200).json({
      success: response ? true : false,
      createOrder: response ? { response } : 'Something went wrong'
    })
  }),
  updateStatusOrder:expressAsyncHandler(async(req, res) => {
    const { orderId } = req.params
    const response = await orderService.updateStatusOrder(orderId, req.body)
    return res.status(200).json({
      success: response ? true : false,
      updateStatusOrder: response ? { response } : 'Something went wrong'
    })
  }),
  getOrder:expressAsyncHandler(async(req, res) => {
    const { orderId } = req.params
    const response = await orderService.getOrder(orderId, req.body)
    return res.status(200).json({
      success: response ? true : false,
      getOrder: response ? { response } : 'Something went wrong'
    })
  }),
  // Filtering, sorting, pagination
  getOrders: expressAsyncHandler(async (req, res) => {
    const filter = pick(req.query, ['title'])
    const options= pick(req.query, ['sortBy', 'limit', 'page', 'fields', 'populate'])
    const result = await orderService.queryOrders(filter, options)
    return res.status(200).json({
      success:result?true:false,
      productData:result ? result :'Cannot get product'
    })
  })
}

module.exports = orderController