var mongoose = require('mongoose') // Erase if already required
var paginate = require('./plugins').paginate

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
  title: {
    type: mongoose.Schema.Types.String,
    required: true,
    trim: true
  },
  slug: {
    type: mongoose.Schema.Types.String,
    // required: true,
    // unique: true,
    lowercase: true
  },
  description: {
    type: mongoose.Schema.Types.String
  },
  brand: {
    type: mongoose.Schema.Types.Array,
    required: true
  },
  price: {
    type: mongoose.Schema.Types.Number,
    required: true
  },
  category: {
    type: mongoose.Types.ObjectId,
    ref: 'ProductCategory'
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
    type: mongoose.Schema.Types.Array
  },
  storage: {
    type: mongoose.Schema.Types.Array
  },
  discount:{
    type: mongoose.Schema.Types.Number,
    default: 0
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
  },
  attributes:{
    type: Array
  }
},
{
  strictPopulate: false,
  timestamps: true
})

// add plugin that converts mongoose to json
productSchema.plugin(paginate)
//Export the model
var ProductModel = mongoose.models.Product || mongoose.model('Product', productSchema)

module.exports = ProductModel
