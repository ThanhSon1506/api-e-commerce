const expressAsyncHandler = require('express-async-handler')
import User from '~/models/User.js'

const addressService = {
  updateUserAddress:expressAsyncHandler(async(userId, addressBody) => {
    const response = await User.findByIdAndUpdate(userId, { $push:{ address:addressBody.address } }, { new:true }).select('-password -role -refreshToken')
    return response
  })
}

module.exports = addressService