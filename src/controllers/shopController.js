import expressAsyncHandler from 'express-async-handler'
import httpStatus from 'http-status'
import { shopService } from '~/services'
import pick from '~/utils/pick'

const shopController = {
  createShop: expressAsyncHandler(async (req, res) => {

    const domain = req.headers['x-header-domain']

    req.body.domain = domain

    let { shop, ...tokens } = await shopService.createShop(req.body)

    return res.status(200).json({
      success:false,
      shop,
      accessToken: tokens.access.token,
      refreshToken: tokens.refresh.token
    })
  })
}
module.exports = shopController
