const mongoose = require('mongoose') // Erase if already required
const { paginate } = require('./plugins')

// Declare the Schema of the Mongo model
var couponSchema = new mongoose.Schema({
  name:{
    type:mongoose.Schema.Types.String,
    required:true,
    unique:true,
    uppercase:true
  },
  slug:{
    type:mongoose.Schema.Types.String,
    unique:true,
    index:true
  },
  discount:{
    type:mongoose.Schema.Types.Number,
    required:true
  },
  expiry:{
    type:mongoose.Schema.Types.Date,
    required:true,
    unique:true
  }

})
// add plugin that converts mongoose to json
couponSchema.plugin(paginate)
//Export the model
module.exports = mongoose.model('Coupon', couponSchema)