const orderController = require('~/controllers/orderController')
const auth = require('~/middleware/auth')
const express = require('express')
const extendRouter = require('~/utils/extendRouter')
const router = extendRouter(express.Router())
//======================================CRUD ORDER================================
router
  .routeWithTag('/', { tag: 'Order' })
  .post(auth(), orderController.createOrder)
  .get(auth(), orderController.getOrders)
router.routeWithTag('/status/:orderId', { tag:'Order' }).put(auth(), orderController.updateStatusOrder)
router
  .routeWithTag('/:orderId', { tag: 'Order' })
  .get(auth(), orderController.getOrder)
module.exports = router