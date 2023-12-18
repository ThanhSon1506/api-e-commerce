const express = require('express')
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
// const { swaggerDocuments } = require('~/docs/swagger')
const getSwaggerDefinitions = require('~/docs/swaggerDef')

const router = express.Router()

const swaggerDefinition= getSwaggerDefinitions()
const specs = swaggerJSDoc({
  swaggerDefinition,
  apis: ['./src/routes/v1/*.js', './src/models/*.js']
})


router.use('/', swaggerUi.serve)

router.get(
  '/',
  swaggerUi.setup(specs, {
    explorer: true
  })
)

module.exports = router


