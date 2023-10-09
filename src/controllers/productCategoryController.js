import expressAsyncHandler from 'express-async-handler'
import ProductCategory from '~/models/ProductCategory'

const productCategoryController = {
  createCategory: expressAsyncHandler(async (req, res) => {
    const response = await ProductCategory.create(req.body)
    return res.status(200).json({
      success: response ? true : false,
      createdCategory: response ? response : 'Cannot create new product-category'
    })
  }),
  getCategory: expressAsyncHandler(async (req, res) => {
    const response = await ProductCategory.find().select('title _id')
    return res.status(200).json({
      success: response ? true : false,
      productCategories: response ? response : 'Cannot create new product-category'
    })
  }),
  updateCategory: expressAsyncHandler(async (req, res) => {
    const { pcid } = req.params
    const response = await ProductCategory.findByIdAndUpdate(pcid, req.body, { new: true })
    return res.status(200).json({
      success: response ? true : false,
      updateCategory: response ? response : 'Cannot update product-category'
    })
  }),
  deleteCategory: expressAsyncHandler(async (req, res) => {
    const { pcid } = req.params
    const response = await ProductCategory.findByIdAndDelete(pcid)
    return res.status(200).json({
      success: response ? true : false,
      deleteCategory: response ? response : 'Cannot delete product-category'
    })
  })

}

module.exports = productCategoryController
