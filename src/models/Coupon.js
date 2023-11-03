const mongoose = require('mongoose') // Erase if already required
const { toJSON, paginate } = require('./plugins')

// Declare the Schema of the Mongo model
var couponSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true,
    unique:true,
    uppercase:true
  },
  slug:{
    type:String,
    unique:true,
    index:true
  },
  discount:{
    type:Number,
    required:true
  },
  expiry:{
    type:Date,
    required:true,
    unique:true
  }

})
// add plugin that converts mongoose to json
couponSchema.plugin(toJSON)
couponSchema.plugin(paginate)
//Export the model
module.exports = mongoose.model('Coupon', couponSchema)