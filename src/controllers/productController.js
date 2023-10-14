
import expressAsyncHandler from 'express-async-handler'
import { productService } from '~/services'
import Product from '~/models/Product'
import slugify from 'slugify'
import pick from '~/utils/pick'

const productController = {
  createProduct: expressAsyncHandler(async (req, res) => {
    if (Object.keys(req.body).length === 0) throw new Error('Missing inputs')
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
    const filter = pick(req.query, ['title', 'role', 'price'])
    const options= pick(req.query, ['sortBy', 'limit', 'page', 'fields','populate'])
    const result = await productService.queryProducts(filter, options)
    return res.status(200).json({
      success:result?true:false,
      productData:result ? result :'Cannot get product'
    })
  }),
  updateProduct: expressAsyncHandler(async (req, res) => {
    const { pid } = req.params
    if (req.body && req.body.title) req.body.slug = slugify(req.body.title, { locale: 'vi' })
    const updateProduct = await Product.findByIdAndUpdate(pid, req.body, { new: true })
    return res.status(200).json({
      success: updateProduct ? true : false,
      updateProduct: updateProduct ? updateProduct : 'Cannot update product'
    })
  }),
  deleteProduct: expressAsyncHandler(async (req, res) => {
    const { pid } = req.params
    if (req.body && req.body.title) req.body.slug = slugify(req.body.title)
    const deleteProduct = await Product.findByIdAndDelete(pid)
    return res.status(200).json({
      success: deleteProduct ? true : false,
      deleteProduct: deleteProduct ? deleteProduct : 'Cannot delete product'
    })
  }),
  ratingProduct: expressAsyncHandler(async (req, res) => {
    const { id } = req.user
    const { star, comment, pid } = req.body
    if (!star || !pid) throw new Error('Missing inputs')
    const ratingProduct = await Product.findById(pid)
    const alreadyRating = ratingProduct?.ratings?.find(element => element.posteBy.toString() === id)
    if (alreadyRating) {
      // update star and comment
      await Product.updateOne({
        ratings: { $elemMatch: alreadyRating }
      }, {
        $set: {
          'ratings.$.star': star,
          'ratings.$.comment': comment
        }
      }, { new: true })
    } else {
      // add star and comment
      await Product.findByIdAndUpdate(pid, {
        $push: { ratings: { star, comment, posteBy: id } }
      }, { new: true })
    }
    const updateProduct = await Product.findById(pid)
    const ratingCount = updateProduct.ratings.length
    const sumRatings = updateProduct.ratings.reduce((sum, element) => sum + +element.star, 0)
    updateProduct.totalRating = Math.round(sumRatings * 10 / ratingCount) / 10
    await updateProduct.save()

    return res.status(200).json({
      status: true,
      updateProduct
    })
  })
}
module.exports = productController