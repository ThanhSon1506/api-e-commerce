import mongoose from 'mongoose' // Erase if already required
import { paginate, toJSON } from './plugins'

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
  title: {
    type: mongoose.Schema.Types.String,
    required: true,
    trim: true
  },
  slug: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: mongoose.Schema.Types.String,
    required: true
  },
  brand: {
    type: mongoose.Schema.Types.String,
    required: true
  },
  price: {
    type: mongoose.Schema.Types.Number,
    required: true
  },
  category: {
    type: mongoose.Types.ObjectId,
    ref: 'Category'
  },
  quantity: {
    type: mongoose.Schema.Types.Number,
    default: 0
  },
  sold: {
    type: mongoose.Schema.Types.Number,
    default: 0
  },
  images: {
    type: Array
  },
  color: {
    type: mongoose.Schema.Types.String,
    enum: ['Black', 'Grown', 'Red']
  },
  ratings: [
    {
      star: { type: mongoose.Schema.Types.Number },
      posteBy: { type: mongoose.Types.ObjectId, ref: 'User' },
      comment: { type: mongoose.Schema.Types.String }
    }
  ],
  totalRating: {
    type: mongoose.Schema.Types.Number,
    default: 0
  }
},
{
  strictPopulate: false,
  timestamps: true
})
// add plugin that converts mongoose to json
productSchema.plugin(toJSON)
productSchema.plugin(paginate)
//Export the model
module.exports = mongoose.model('Product', productSchema)