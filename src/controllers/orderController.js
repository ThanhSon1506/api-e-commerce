const expressAsyncHandler = require('express-async-handler')
const { orderService, userService } = require('~/services')

const orderController= {
  createOrder:expressAsyncHandler(async(req, res) => {
    const { sub:userId } = req.user
    const userCart = await userService.getUserById(userId)
    const response = await orderService.createOrder(userCart)
    return res.status(200).json({
      success: response ? true : false,
      createOrder: response ? { response } : 'Cannot create order'
    })
  })
}

module.exports = orderController