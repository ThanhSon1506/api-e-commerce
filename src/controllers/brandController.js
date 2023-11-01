import expressAsyncHandler from 'express-async-handler'
import httpStatus from 'http-status'
import Brand from '~/models/Brand'
import { brandService } from '~/services'
import pick from '~/utils/pick'

const brandController = {
  createBrand: expressAsyncHandler(async (req, res) => {
    try {
      const response = await brandService.createBrand(req.body)
      return res.status(200).json({
        success: response ? true : false,
        createdBrand: response ? response : 'Cannot create new brand'
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
  getBrand:expressAsyncHandler(async(req, res) => {
    const { brandId } =req.params
    const result = await brandService.getBrand(brandId)
    return res.status(200).json({
      success: result ? true : false,
      Brand: result ? result : 'Cannot get brand'
    })
  }),
  getBrands: expressAsyncHandler(async (req, res) => {
    const filter = pick(req.query, ['title'])
    const options= pick(req.query, ['sortBy', 'limit', 'page', 'fields'])
    const result = await brandService.queryBrand(filter, options)
    return res.status(200).json({
      success: result ? true : false,
      Brand: result ? result : 'Cannot create new brand'
    })
  }),
  updateBrand: expressAsyncHandler(async (req, res) => {
    const { brandId } = req.params
    const response = await brandService.updateBrand(brandId, req.body)
    return res.status(200).json({
      success: response ? true : false,
      updateBrand: response ? response : 'Cannot update brand'
    })
  }),
  deleteBrand: expressAsyncHandler(async (req, res) => {
    const { brandId } = req.params
    const response = await Brand.findByIdAndDelete(brandId)
    return res.status(200).json({
      success: response ? true : false,
      deleteBrand: response ? response : 'Cannot delete brand'
    })
  })

}

module.exports = brandController
