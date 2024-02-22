import express from 'express'
import userRoute from './userRoute'
import authRoute from './authRoute'
import productRoute from './productRoute'
import productCategoryRoute from './productCategoryRoute'
import blogCategoryRoute from './blogCategoryRoute'
import blogRoute from './blogRoute'
import docsRoute from './docsRoute'
import brandRoute from './brandRoute'
import couponRoute from './couponRoute'
import orderRoute from './orderRoute'
import shopRoute from './shopRoute'
import config from '../../../config/config'

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
    route: brandRoute
  },
  {
    path: '/coupon',
    route: couponRoute
  },
  {
    path: '/order',
    route:orderRoute
  },
  {
    path: '/shop',
    route:shopRoute
  },
  {
    path: '/docs',
    route: docsRoute
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

export default router
