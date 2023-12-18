const mongoose = require('mongoose')

const shopSchema = mongoose.Schema(
  {
    country: { type: String, default: null },
    country_code: { type: String, default: null },
    province: { type: String, default: null },
    province_code: { type: String, default: null },
    address1: { type: String, default: null },
    email: { type: String, default: null },
    name: { type: String, default: null },
    shop_owner: { type: String, default: null },
    phone: { type: String, default: null },
    timezone: { type: String, default: null },
    zip: { type: String, default: null },
    money_format: { type: String, default: null },
    domain: { type: String, default: null }
  },
  {
    timestamps: true
  }
)

/**
 * @typedef Shop
 */
module.exports = mongoose.model('Shop', shopSchema)
