import mongoose from 'mongoose' // Erase if already required
import { paginate } from './plugins'

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema({
  title: {
    type: mongoose.Schema.Types.String,
    required: true
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
  category: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true
  },
  numberViews: {
    type: mongoose.Schema.Types.Number,
    default: 0
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  dislikes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  image: {
    type: mongoose.Schema.Types.String,
    default: 'https://images.pexels.com/photos/3826683/pexels-photo-3826683.jpeg'
  },
  author: {
    type: mongoose.Schema.Types.String,
    default: 'Admin'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})
// Function to increment numberViews
blogSchema.statics.incrementViews = async function (blogId) {
  return await this.findByIdAndUpdate(blogId, { $inc: { numberViews: 1 } }, { new: true })
}
// add plugin that converts mongoose to json
blogSchema.plugin(paginate)
//Export the model
module.exports = mongoose.model('Blog', blogSchema)