const BlogCategoryController = require('~/controllers/blogCategoryController')
const auth = require('~/middleware/auth')
const validate = require('~/middleware/validate')
const extendRouter = require('~/utils/extendRouter')
const blogCategoryValidation = require('~/validations/blogCategory.validation')
const express = require('express')
const router = extendRouter(express.Router())

//====================CRUD BLOG CATEGORY==================================
router.routeWithTag('/', { tag: 'blogCategory' })
  .post(auth('manageUsers'), validate(blogCategoryValidation.createBlogCategory), BlogCategoryController.createCategory)
  .get( validate(blogCategoryValidation.getBlogCategories), BlogCategoryController.getCategory)
router.routeWithTag('/:bcid', { tag: 'blogCategory' })
  .put( auth('manageUsers'), validate(blogCategoryValidation.updateBlogCategory), BlogCategoryController.updateCategory)
  .delete( auth('manageUsers'), validate(blogCategoryValidation.deleteBlogCategory), BlogCategoryController.deleteCategory)
module.exports = router
