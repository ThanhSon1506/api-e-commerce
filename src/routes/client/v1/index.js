const express = require('express')
const config = require('~/config/config')
import productRoute from './productRoute'
const router = express.Router()

const defaultRoutes = [
  {
    path: '/',
    route: productRoute
  }
 
]

// const devRoutes = [
//   {
//     path: '/docs',
//     route: docsRoute
//   }]

defaultRoutes?.forEach((route) => {
  router.use(route.path, route.route)
})

/* istanbul ignore next */
// if (config.env === 'development') {
//   devRoutes.forEach((route) => {
//     router.use(route.path, route.route)
//   })
// }

module.exports = router
