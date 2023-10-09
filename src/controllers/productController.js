import expressAsyncHandler from 'express-async-handler'
import Product from '~/models/Product'
import slugify from 'slugify'

const productController = {
  createProduct: expressAsyncHandler(async (req, res) => {
    if (Object.keys(req.body).length === 0) throw new Error('Missing inputs')
    if (req.body && req.body.title) req.body.slug = slugify(req.body.title, { locale: 'vi' })
    const newProduct = await Product.create(req.body)
    return res.status(200).json({
      success: newProduct ? true : false,
      createProduct: newProduct ? newProduct : 'Cannot create new product'
    })
  }),
  getProduct: expressAsyncHandler(async (req, res) => {
    const { pid } = req.params
    const product = await Product.findById(pid)
    return res.status(200).json({
      success: product ? true : false,
      productData: product ? product : 'Cannot get product'
    })
  }),
  // Filtering, sorting, pagination
  getProducts: expressAsyncHandler(async (req, res) => {
    const queries = { ...req.query }
    // Convent string special
    const excludeFields = ['limit', 'sort', 'page', 'fields']
    excludeFields.forEach(element => delete queries[element])
    // Format operator with syntax mongodb
    let queryString = JSON.stringify(queries)
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, matchElement => `$${matchElement}`)
    const formattedQueries = JSON.parse(queryString)
    // Filtering
    if (queries?.title) formattedQueries.title = {
      $regex: queries.title,
      $options: 'i'
    }
    let queryCommand = Product.find(formattedQueries)
    const page = +req.query.page || 1
    const limit = +req.query.limit || process.env.LIMIT_PRODUCTS
    const skip = (page - 1) * limit
    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ')
      queryCommand = queryCommand.sort(sortBy)
    }

    // Fields limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ')
      queryCommand = queryCommand.select(fields)
    }
    // Pagination
    queryCommand.skip(skip).limit(limit)

    // Execute query
    // Số lượng sp thỏa mãn điều kiện !== số lượng sp trả về 1 lần gọi Api
    queryCommand.then(async (response) => {
      const counts = await Product.find(formattedQueries).countDocuments()
      return res.status(200).json({
        success: response ? true : false,
        counts,
        products: response ? response : 'Cannot get products'
      })
    }).catch((err) => {
      if (err) throw new Error(err.message)
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