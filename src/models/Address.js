const mongoose = require('mongoose')

const wardSchema = new mongoose.Schema({
  name: {
    type: mongoose.Schema.Types.String,
    required: true
  },
  value: {
    type: mongoose.Schema.Types.String,
    required: true
  }
})

const districtSchema = new mongoose.Schema({
  name: {
    type: mongoose.Schema.Types.String,
    required: true
  },
  value: {
    type: mongoose.Schema.Types.String,
    required: true
  },
  wards: [wardSchema]
})

const provinceSchema = new mongoose.Schema({
  name: {
    type: mongoose.Schema.Types.String,
    required: true
  },
  value: {
    type: mongoose.Schema.Types.String,
    required: true
  },
  districts: [districtSchema],
  address: {
    type: mongoose.Schema.Types.String,
    required: false
  }
})

const AddressModel = mongoose.models.Address || mongoose.model('Address', provinceSchema)

module.exports = AddressModel