const expressAsyncHandler = require('express-async-handler')
import Shop from '~/models/Shop'
import Location from '~/models/Location'
import User from '~/models/User'
import tokenService from '~/services/tokenService'

const shopService = {
  createShop: expressAsyncHandler(async (shopBody) => {
    let shop = await Shop.create(shopBody)
    let data = shopBody
    let location = await Location.create({
      org_id: shop._id,
      name: 'Địa điểm mặc định',
      location_type: 'default',
      email: data.email,
      address1: data.address1,
      address2: null,
      zip: data.zip,
      city: null,
      province: data.province,
      country: data.country,
      phone: data.phone,
      country_code: data.country_code,
      country_name: data.country_name,
      province_code: data.province_code,
      district: data.district,
      district_code: data.district_code,
      ward: data.ward,
      ward_code: data.ward_code,
      created_at: new Date(),
      updated_at: new Date(),
      is_primary: true,
      is_unavailable_quantity: false,
      type: 'default'
    })
    let user = await User.create({
      org_id: shop._id,
      firstName: 'Dew',
      lastName: 'Zn',
      mobile: '32',
      email: data.email,
      password: data.password,
      role: ['admin'],
      cart: [],
      address: [],
      wishlist: [],
      isBlocked: false,
      isEmailVerified: true
    })

    const tokens = await tokenService.generateAuthTokens(user)
    return { ...tokens, shop }
  })
}

module.exports = shopService
