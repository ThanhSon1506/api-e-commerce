const userRoute = require('./userRoute')
const authRoute = require('./authRoute')
const productRoute = require('./productRoute')
const productCategoryRoute = require('./productCategoryRoute')
const blogCategoryRoute = require('./blogCategoryRoute')
const blogRoute = require('./blogRoute')
const docsRoute =require('./docsRoute')
const brandRoute =require('./brandRoute')
const couponRoute =require('./couponRoute')
const orderRoute =require('./orderRoute')
const express = require('express')
const config = require('~/config/config')

const router = express.Router()

const defaultRoutes = [
  {
    path: '/',
    route: docsRoute
  },
  {
    path: '/auth',
    route: authRoute
  },
  {
    path: '/user',
    route: userRoute
  },
  {
    path: '/product',
    route: productRoute
  },
  {
    path: '/blog',
    route: blogRoute
  },
  {
    path: '/product-category',
    route: productCategoryRoute
  },
  {
    path: '/blog-category',
    route: blogCategoryRoute
  },
  {
    path: '/brand',
    route:brandRoute
  },
  {
    path: '/coupon',
    route:couponRoute
  },
  {
    path: '/order',
    route:orderRoute
  }
]

const devRoutes = [
  {
    path: '/docs',
    route: docsRoute
  }]

defaultRoutes?.forEach((route) => {
  router.use(route.path, route.route)
})

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route)
  })
}

module.exports = router
