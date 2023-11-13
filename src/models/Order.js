const mongoose = require('mongoose') // Erase if already required
const { paginate } = require('./plugins')

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema({
  products:[{
    product:{ type:mongoose.Schema.Types.ObjectId, ref:'Product' },
    count:Number,
    color:mongoose.Schema.Types.String
  }],
  status:{
    type:mongoose.Schema.Types.String,
    default:'Processing',
    enum:['Cancelled', 'Processing', 'Successes']
  },
  paymentIntent:{
  },
  total:{
    type:mongoose.Schema.Types.Number
  },
  coupon:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  },
  orderBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  }
})
// add plugin that converts mongoose to json
orderSchema.plugin(paginate)
//Export the model
module.exports = mongoose.model('Order', orderSchema)