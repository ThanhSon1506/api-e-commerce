import mongoose from 'mongoose' // Erase if already required
import { paginate, toJSON } from './plugins'

// Declare the Schema of the Mongo model
var productCategorySchema = new mongoose.Schema({
  title: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true,
    index: true
  },
  slug: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true,
    lowercase: true
  }
}, {
  timestamps: true
})

// add plugin that converts mongoose to json
productCategorySchema.plugin(toJSON)
productCategorySchema.plugin(paginate)
//Export the model
module.exports = mongoose.model('ProductCategory', productCategorySchema)