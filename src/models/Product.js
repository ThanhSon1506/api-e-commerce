import mongoose from 'mongoose' // Erase if already required
import { paginate, toJSON } from './plugins'

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: mongoose.Types.ObjectId,
    ref: 'Category'
  },
  quantity: {
    type: Number,
    default: 0
  },
  sold: {
    type: Number,
    default: 0
  },
  images: {
    type: Array
  },
  color: {
    type: String,
    enum: ['Black', 'Grown', 'Red']
  },
  ratings: [
    {
      star: { type: Number },
      posteBy: { type: mongoose.Types.ObjectId, ref: 'User' },
      comment: { type: String }
    }
  ],
  totalRating: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})
// add plugin that converts mongoose to json
productSchema.plugin(toJSON)
productSchema.plugin(paginate)
//Export the model
module.exports = mongoose.model('Product', productSchema)