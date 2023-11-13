const expressAsyncHandler = require('express-async-handler')
import User from '~/models/User'

const cartService = {
  createCart: expressAsyncHandler(async (userId, cartBody) => {
    const { pid, quantity, color } = cartBody
    const userObject = await User.findById(userId)
    const alreadyProduct= userObject.cart.find(el => el.product._id.toString()===pid && el.color === color)
    if (alreadyProduct) {
      if (alreadyProduct.color === color) {
        return await User.findOneAndUpdate({ cart:{ $elemMatch: alreadyProduct } }, { $set:{ 'cart.$.quantity':quantity } }, { new:true })
      } else {
        return await User.findByIdAndUpdate(userId, { $push:{ cart:{ product:pid, quantity, color } } }, { new:true })

      }
    } else {
      return await User.findByIdAndUpdate(userId, { $push:{ cart:{ product:pid, quantity, color } } }, { new:true })
    }
  })
}

module.exports = cartService