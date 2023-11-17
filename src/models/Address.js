const mongoose = require('mongoose')

const wardSchema = new mongoose.Schema({
  name: {
    type: mongoose.Schema.Types.String,
    required: true
  }
})

const districtSchema = new mongoose.Schema({
  name: {
    type: mongoose.Schema.Types.String,
    required: true
  },
  wards: [wardSchema]
})

const provinceSchema = new mongoose.Schema({
  name: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true,
    lowercase: true
  },
  districts: [districtSchema],
  address: {
    type: mongoose.Schema.Types.String,
    required: false
  }
})

module.exports = mongoose.model('Address', provinceSchema)