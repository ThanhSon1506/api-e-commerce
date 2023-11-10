const expressAsyncHandler = require('express-async-handler')
const httpStatus = require('http-status')
const couponService = require('~/services/couponService')
const pick = require('~/utils/pick')

const couponController = {
  createCoupon: expressAsyncHandler(async (req, res) => {
    try {
      const response = await couponService.createCoupon(req.body)
      return res.status(200).json({
        success: response ? true : false,
        createdCoupon: response ? response : 'Cannot create new Coupon'
      })
    } catch (error) {
      if (error.message.includes('duplicate key') ) {
        const keyValue = Object.keys(error['keyValue'])[0]
        res.status(httpStatus.CONFLICT).send({ message:`${keyValue} đã tồn tại trong hệ thống.` })
      } else {
        res.status(httpStatus.CONFLICT).send({ message:error.message })
      }
    }
  }),
  getCoupon:expressAsyncHandler(async(req, res) => {
    const { couponId } =req.params
    const result = await couponService.getCoupon(couponId)
    return res.status(200).json({
      success: result ? true : false,
      Coupon: result ? result : 'Cannot get coupon'
    })
  }),
  getCoupons: expressAsyncHandler(async (req, res) => {
    const filter = pick(req.query, ['title'])
    const options= pick(req.query, ['sortBy', 'limit', 'page', 'fields'])
    const result = await couponService.queryCoupon(filter, options)
    return res.status(200).json({
      success: result ? true : false,
      couponData: result ? result : 'Cannot create new brand'
    })
  }),
  updateCoupon: expressAsyncHandler(async (req, res) => {
    const { couponId } = req.params
    const response = await couponService.updateCoupon(couponId, req.body)
    return res.status(200).json({
      success: response ? true : false,
      updateBrand: response ? response : 'Cannot update brand'
    })
  }),
  deleteCoupon: expressAsyncHandler(async (req, res) => {
    const { couponId } = req.params
    const response = await couponService.deleteCoupon(couponId)
    return res.status(200).json({
      success: response ? true : false,
      deleteCoupon: response ? response : 'Cannot delete brand'
    })
  })
}

module.exports = couponController