import mongoose from 'mongoose' // Erase if already required
import { paginate } from './plugins'

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
  },
  link: {
    type: mongoose.Schema.Types.String,
    default:null
  },
  image:{
    type: mongoose.Schema.Types.String,
    default:null

  },
  subcategories: {
    type: mongoose.Schema.Types.Array
  }
}, {
  timestamps: true
})

// add plugin that converts mongoose to json
productCategorySchema.plugin(paginate)
//Export the model
module.exports = mongoose.model('ProductCategory', productCategorySchema)