const extendRouter = (router) => {
  router.routeWithTag = (path, route) => {
    const newRoute = router.route(path)
    Object.assign(newRoute, route)
    newRoute.routeTag = route.tag || 'DefaultTag'
    const routeHandler = newRoute.handle
    newRoute.handle = function (req, res, next) {
      routeHandler(req, res, next)
      this.routeTag = route.tag
    }
    return newRoute
  }
  return router
}

module.exports = extendRouter
