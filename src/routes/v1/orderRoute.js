const orderController = require('~/controllers/orderController')
const auth = require('~/middleware/auth')
const express = require('express')
const extendRouter = require('~/utils/extendRouter')
const router = extendRouter(express.Router())
//======================================CRUD ORDER================================
router
  .routeWithTag('/', { tag: 'Order' })
  .post(auth(), orderController.createOrder)
module.exports = router
