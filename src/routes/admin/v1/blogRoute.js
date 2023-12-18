const { uploadCloud } = require('~/config/cloudinary.config')
const blogController = require('~/controllers/blogController')
const auth = require('~/middleware/auth')
const authMiddleware =require('~/middleware/authMiddleware')
const { verifyToken } =authMiddleware
const express = require('express')
const extendRouter = require('~/utils/extendRouter')
const router = extendRouter(express.Router())
//===========================CRUD BLOG==========================
router
  .routeWithTag('/', { tag: 'Blog' })
  .get(blogController.getBlogs)
  .post( auth('manageBlogs'), blogController.createBlog)
router
  .routeWithTag('/like/:bid', { tag: 'Blog' })
  .put( verifyToken, blogController.likeBlog)
router
  .routeWithTag('/dislike/:bid', { tag: 'Blog' })
  .put( verifyToken, blogController.disLikeBlog)
router
  .routeWithTag('/upload/:bid', { tag: 'Blog' })
  .put( verifyToken, uploadCloud.single('image'), blogController.uploadImagesBlog)
router
  .routeWithTag('/:bid', { tag: 'Blog' })
  .put( auth('manageBlogs'), blogController.updateBlog)
  .delete(auth('manageBlogs'), blogController.deleteBlog)
  .get(blogController.getBlog)

module.exports = router
