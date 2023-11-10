const mongoose = require('mongoose') // Erase if already required
const { toJSON, paginate } = require('./plugins')

// Declare the Schema of the Mongo model
var brandSchema = new mongoose.Schema({
  title:{
    type:mongoose.Schema.Types.String,
    required:true,
    unique:true,
    index:true
  },
  slug:{
    type:mongoose.Schema.Types.String,
    required:true,
    unique:true,
    index:true
  }
}, {
  timestamps:true
})
// add plugin that converts mongoose to json
brandSchema.plugin(toJSON)
brandSchema.plugin(paginate)
//Export the model
module.exports = mongoose.model('Brand', brandSchema)