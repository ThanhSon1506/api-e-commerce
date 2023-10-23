import expressAsyncHandler from 'express-async-handler'
import BlogCategory from '~/models/BlogCategory'
import { blogCategoryService } from '~/services'
import pick from '~/utils/pick'

const blogCategoryController = {
  createCategory: expressAsyncHandler(async (req, res) => {
    const response = await blogCategoryService.createBlogCategories(req.body)
    return res.status(200).json({
      success: response ? true : false,
      createdCategory: response ? response : 'Cannot create new blog-category'
    })
  }),
  getCategory: expressAsyncHandler(async (req, res) => {
    const filter = pick(req.query, ['title', 'role'])
    const options= pick(req.query, ['sortBy', 'limit', 'page', 'fields', 'populate'])
    const result = await blogCategoryService.queryBlogCategories(filter, options)
    return res.status(200).json({
      success: result ? true : false,
      blogCategories: result ? result : 'Cannot create new blog-category'
    })
  }),
  updateCategory: expressAsyncHandler(async (req, res) => {
    const { bcid } = req.params
    const response = await blogCategoryService.updateBlogCategories(bcid, req.body)
    return res.status(200).json({
      success: response ? true : false,
      updateCategory: response ? response : 'Cannot update blog-category'
    })
  }),
  deleteCategory: expressAsyncHandler(async (req, res) => {
    const { bcid } = req.params
    const response = await BlogCategory.findByIdAndDelete(bcid)
    return res.status(200).json({
      success: response ? true : false,
      deleteCategory: response ? response : 'Cannot delete blog-category'
    })
  })

}

module.exports = blogCategoryController
