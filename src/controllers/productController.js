
import expressAsyncHandler from 'express-async-handler'
import httpStatus from 'http-status'
import { productService } from '~/services'
import cloudinaryService from '~/services/cloudinaryService'
import pick from '~/utils/pick'

const productController = {
  createProduct: expressAsyncHandler(async (req, res) => {
    try {
      const newProduct = await productService.createProduct(req.body)
      return res.status(200).json({
        success: newProduct ? true : false,
        createProduct: newProduct ? newProduct : 'Cannot create new product'
      })
    } catch (error) {
      if (error.message.includes('duplicate key') ) {
        const keyValue = Object.keys(error['keyValue'])[0]
        res.status(httpStatus.CONFLICT).send({ message:`${keyValue} đã tồn tại trong hệ thống.` })
      } else {
        res.status(httpStatus.CONFLICT).send({ message:error.message })
      }
    }
    const newProduct = await productService.createProduct(req.body)
    return res.status(200).json({
      success: newProduct ? true : false,
      createProduct: newProduct ? newProduct : 'Cannot create new product'
    })
  }),
  getProduct: expressAsyncHandler(async (req, res) => {
    const { pid } = req.params
    const product = await productService.getProductById(pid)
    return res.status(200).json({
      success: product ? true : false,
      productData: product ? product : 'Cannot get product'
    })
  }),
  // Filtering, sorting, pagination
  getProducts: expressAsyncHandler(async (req, res) => {
    const filter = pick(req.query, ['title', 'price'])
    const options= pick(req.query, ['sortBy', 'limit', 'page', 'fields', 'populate'])
    const result = await productService.queryProducts(filter, options)
    return res.status(200).json({
      success:result?true:false,
      productData:result ? result :'Cannot get product'
    })
  }),
  updateProduct: expressAsyncHandler(async (req, res) => {
    const { pid } = req.params

    const updateProduct = await productService.updateProductById(pid, req.body)
    return res.status(200).json({
      success: updateProduct ? true : false,
      updateProduct: updateProduct ? updateProduct : 'Cannot update product'
    })
  }),
  deleteProduct: expressAsyncHandler(async (req, res) => {
    const { pid } = req.params
    const deleteProduct = await productService.deleteProductById(pid)
    return res.status(200).json({
      success: deleteProduct ? true : false,
      deleteProduct: deleteProduct ? deleteProduct : 'Cannot delete product'
    })
  }),
  ratingProduct: expressAsyncHandler(async (req, res) => {
    const { sub:uid } = req.user
    const updateProduct = await productService.ratingProduct(uid, req.body)
    return res.status(200).json({
      status: true,
      updateProduct
    })
  }),
  uploadImagesProduct:expressAsyncHandler(async (req, res) => {
    const { pid } = req.params
    const response = await cloudinaryService.uploadImagesProduct(req.files, pid)
    return res.status(200).json({
      success: response ? true : false,
      uploadImages: response ? response : 'Cannot delete product'
    })
  })

}
module.exports = productController