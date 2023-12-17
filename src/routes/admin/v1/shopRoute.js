const express = require('express')
const shopController = require('~/controllers/shopController')
const auth = require('~/middleware/auth')
const extendRouter = require('~/utils/extendRouter')
const router = extendRouter(express.Router())

//============================CRUD user===============================
router
  .routeWithTag('/', { tag: 'Shop' })
  .post(shopController.createShop)

module.exports = router
