var mongoose = require('mongoose'); // Erase if already required
var paginate = require('./plugins').paginate;

// Declare the Schema of the Mongo model
var blogCategorySchema = new mongoose.Schema({
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
});

// add plugin that converts mongoose to json
blogCategorySchema.plugin(paginate);

//Export the model
var BlogCategoryModel = mongoose.models.BlogCategory || mongoose.model('BlogCategory', blogCategorySchema);

module.exports = BlogCategoryModel;
