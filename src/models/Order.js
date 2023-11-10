const mongoose = require('mongoose') // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema({
  products:[{
    product:{ type:mongoose.Types.ObjectId, ref:'Product' },
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
  orderBy:{
    type:mongoose.Types.ObjectId,
    ref:'User'
  }
})

//Export the model
module.exports = mongoose.model('Order', orderSchema)