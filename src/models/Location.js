const mongoose = require('mongoose')

const locationSchema = mongoose.Schema(
  {
    name: { type: String, default: null },
    location_type: { type: String, default: null },
    email: { type: String, default: null },
    address1: { type: String, default: null },
    address2: { type: String, default: null },
    zip: { type: String, default: null },
    city: { type: String, default: null },
    province: { type: String, default: null },
    country: { type: String, default: null },
    phone: { type: String, default: null },
    country_code: { type: String, default: null },
    country_name: { type: String, default: null },
    province_code: { type: String, default: null },
    district: { type: String, default: null },
    district_code: { type: String, default: null },
    ward: { type: String, default: null },
    ward_code: { type: String, default: null },
    creted_at: { type: Date, default: null },
    is_pated_at: { type: Date, default: null },
    updarimary: { type: Boolean, default: false },
    is_unavailable_quantity: { type: Boolean, default: false },
    type: { type: String, default: 'default' },
    is_primary: { type: Boolean, default: false },
    org_id: { type: String, default: null }
  },
  {
    timestamps: true
  }
)


/**
 * @typedef Location
 */
var LocationModel = mongoose.models.Location || mongoose.model('Location', locationSchema)

module.exports = LocationModel
