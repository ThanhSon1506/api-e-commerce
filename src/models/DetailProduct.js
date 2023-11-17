const mongoose = require('mongoose') // Erase if already required
const { paginate } = require('./plugins')

// Declare the Schema of the Mongo model
var detailProductSchema = new mongoose.Schema({
  title:{
    type:mongoose.Schema.Types.String
  },
  content:{
    type:mongoose.Schema.Types.String
  }
}, {
  timestamps:true
})
// add plugin that converts mongoose to json
detailProductSchema.plugin(paginate)
//Export the model
module.exports = mongoose.model('DetailProduct', detailProductSchema)