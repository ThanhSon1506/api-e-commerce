const userRoute = require('./userRoute')
const authRoute = require('./authRoute')
const productRoute = require('./productRoute')
const productCategoryRoute = require('./productCategoryRoute')
const blogCategoryRoute = require('./blogCategoryRoute')
const blogRoute = require('./blogRoute')
const docsRoute =require('./docsRoute')
const express = require('express')
const config = require('~/config/config')

const router = express.Router()

const defaultRoutes = [
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
    path: '/blog-category',
    route: blogCategoryRoute
  },
  {
    path: '/product-category',
    route: productCategoryRoute
  },
  {
    path: '/blog',
    route: blogRoute
  }
]

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute
  }
]

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route)
})

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route)
  })
}

module.exports = router
