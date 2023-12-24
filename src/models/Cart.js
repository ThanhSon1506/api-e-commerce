const mongoose = require('mongoose')
const { paginate } = require('./plugins')

/**
 * 1 là có customer, 2 khách bản lai
 * =>>> login thành công update cusomter vào bảng đó
 * cart token
 * vào trang chủ 1 lần, middlewware()-> check token có cart lên chưa
 * nếu chưa có call api tạo cart bằng cookie, check trong reposnse của axios
 * api tạo cart truyền object => _id
 * kiểm tra _id giỏi hàng=>nếu customer_id kiểm tra trong decode accesstoken thì lưu customẻ_id
 * */
const cartSchema = new mongoose.Schema({
  attributes: {
    // type: Mixed
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  token: {
    type: mongoose.Schema.Types.String,
    default: null
  },
  item_count: {
    type: mongoose.Schema.Types.Number,
    default: 0
  },
  items: {
    type: mongoose.Schema.Types.Array,
    default: []
  },
  total_price: {
    type: mongoose.Schema.Types.Number,
    default: 0
  },
  total_weight: {
    type: mongoose.Schema.Types.Number,
    default: 0
  },
  note: {
    type: mongoose.Schema.Types.String,
    default: null
  },
  location_id: {
    type: mongoose.Schema.Types.String,
    default: null
  },
  customer_id: {
    type: mongoose.Schema.Types.String,
    default: null
  },
  requires_shipping: {
    type: mongoose.Schema.Types.Boolean,
    default: false
  }
})

const Cart = mongoose.model('Cart', cartSchema)
cartSchema.plugin(paginate)
module.exports = Cart