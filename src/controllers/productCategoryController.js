import expressAsyncHandler from 'express-async-handler'
import { productCategoryService } from '~/services'
import pick from '~/utils/pick'

const productCategoryController = {
  createCategory: expressAsyncHandler(async (req, res) => {
    const response = await productCategoryService.createProductCategories(req.body)
    return res.status(200).json({
      success: response ? true : false,
      createdCategory: response ? response : 'Cannot create new product-category'
    })
  }),
  getCategory: expressAsyncHandler(async (req, res) => {
    const filter = pick(req.query, ['title', 'role'])
    const options= pick(req.query, ['sortBy', 'limit', 'page', 'fields', 'populate'])
    const result = await productCategoryService.queryProductCategories(filter, options)
    return res.status(200).json({
      success: result ? true : false,
      productCategories: result ? result : 'Cannot create new product-category'
    })
  }),
  updateCategory: expressAsyncHandler(async (req, res) => {
    const { pcid } = req.params
    const response = await productCategoryService.updateProductCategories(pcid, req.body)
    return res.status(200).json({
      success: response ? true : false,
      updateCategory: response ? response : 'Cannot update product-category'
    })
  }),
  deleteCategory: expressAsyncHandler(async (req, res) => {
    const { pcid } = req.params
    const response = await productCategoryService.deleteProductCategory(pcid)
    return res.status(200).json({
      success: response ? true : false,
      deleteCategory: response ? response : 'Cannot delete product-category'
    })
  })

}

module.exports = productCategoryController
