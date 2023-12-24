const mongoose = require('mongoose')
const glob = require('glob')
const path = require('path')
// const validationObjects = require('~/utils/readAllValidations')
// const { version } = require('../../package.json')
const config = require('~/config/config')
const { convertStringRoute } = require('~/utils/convert')

const getSwaggerDefinitions = () => {
  const modelsPath = './src/models/**/*.js'
  const models = glob.sync(modelsPath)
  const routesPath = './src/routes/admin/v1'
  const routes = glob.sync(`${routesPath}/**/*.js`)

  const swaggerDefinitions = {
    openapi: '3.0.3',
    info: {
      title: 'Swagger Nodejs - OpenAPI 3.0',
      version:'1.0.1',
      description: `
          The Project Nodejs APIs documentation
          - 🪲: bug
          - ⌛: doing
          - 🧑‍🔬: to test
          - 🌟: done, haven't tested yet
          - ✅: done, tested
          - 🚫: deprecated
          - 📄: support load more
        `
    },
    servers: [
      {
        url: `http://localhost:${config.port}/v1`
      }
    ],
    tags: [],
    paths: {},
    definitions: {}
  }
  models.forEach((modelPath) => {
    const modelName = path.basename(modelPath, '.js')
    const model = require(path.resolve(modelPath))
    if (model && model.schema) {
      const modelSchema = model.schema
      const swaggerModelDefinition = convertMongooseSchemaToSwagger(modelSchema)
      swaggerDefinitions.definitions[modelName] = swaggerModelDefinition
    }
  })
  routes.forEach((routePath) => {
    const route = require(path.resolve(routePath))
    const routeName = path.basename(routePath, '.js')
    const routeNameCovert = convertStringRoute(routeName)
    const swaggerEndpoints = convertExpressRouteToSwagger(route, `/${routeNameCovert}`)
    Object.values(swaggerEndpoints).forEach((endpoints) => {
      Object.values(endpoints).forEach((endpoint) => {
        if (endpoint && endpoint.tags && endpoint.tags.length > 0) {
          swaggerDefinitions.tags.push({ name: endpoint.tags[0] })
        }
      })
    })
    Object.assign(swaggerDefinitions.paths, swaggerEndpoints)
  })
  // Object.entries(validationObjects).forEach(([validationName, validationContent]) => {
  //   swaggerDefinitions.definitions[validationName] = convertValidationToSwagger(validationContent)
  // })
  return swaggerDefinitions
}
// const convertValidationToSwagger = (validationContent) => {

//   return validationContent
// }
const convertExpressRouteToSwagger = (route, routePath) => {
  const endpointDefinition = {}
  if (route.stack && Array.isArray(route.stack)) {
    route.stack.forEach((layer) => {
      if (layer.route) {
        const endpoint = layer.route
        const path = `${routePath}${endpoint.path}`
        if (!endpointDefinition[path]) {
          endpointDefinition[path] = {}
        }
        const methods = Object.keys(endpoint.methods)
        methods.forEach((method) => {
          const requestType = convertMongooseSchemaToSwagger(endpoint.schema || {})
          const responseType = { type: 'object', properties: {} }
          endpointDefinition[path][method.toLowerCase()] = {
            summary: `Short description of the ${method} ${path}`,
            parameters: [
              {
                in: 'body',
                name: 'body',
                description: 'Data sent in the request body',
                required: true,
                schema: requestType
              }
            ],
            responses: {
              200: {
                description: 'Successful response',
                schema: responseType
              }
            },
            tags: endpoint.routeTag ? [endpoint.routeTag] : [endpoint.name]
          }
        })
        endpointDefinition[path].name = endpoint.name
      }
    })
  }

  return endpointDefinition
}
const convertMongooseSchemaToSwagger = (schema) => {
  const properties = {}
  const schemaObj = schema && schema.obj
  if (!schemaObj) {
    return { type: 'object', properties }
  }
  Object.keys(schemaObj).forEach((fieldName) => {
    const field = schemaObj[fieldName]
    let type
    if (field.type === mongoose.Schema.Types.String) {
      type = 'string'
    } else if (field.type === mongoose.Schema.Types.Number) {
      type = 'number'
    } else if (field.type === mongoose.Schema.Types.Array) {
      type = 'array'
    } else if (field.type === mongoose.Schema.Types.ObjectId) {
      type = 'ObjectId'
    } else if (field.type === mongoose.Schema.Types.Boolean) {
      type = 'Boolean'
    } else {
      type = 'unknown'
    }
    properties[fieldName] = { type }
  })
  return { type: 'object', properties }
}
module.exports = getSwaggerDefinitions
