const expressAsyncHandler = require('express-async-handler')

const orderService={
  createOrder:expressAsyncHandler(async(userCart) => {
    return await userCart
  })
}
module.exports = orderService