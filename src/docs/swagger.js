const { version } = require('../../package.json')
const config = require('~/config/config')

const expressAsyncHandler = require('express-async-handler')

const swagger={
  docs : {
    tags: [],
    paths: {},
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Access token is missing or invalid'
        }
      }
    }
  },
  useTags :  expressAsyncHandler((options) => {
    swagger.docs.tags.push(options)
  }),
  usePaths : expressAsyncHandler ((options) => {
    if (!options.path || !options.method || !options.tag) return

    swagger.docs.paths[options.path] = swagger.docs.paths[options.path] ?? {}
    swagger.docs.paths[options.path][options.method] = swagger.docs.paths[options.path][options.method] ?? {}

    swagger.docs.paths[options.path][options.method].tags = [options.tag]
    swagger.docs.paths[options.path][options.method].description = options.description ?? ''
    swagger.docs.paths[options.path][options.method].summary = options.summary

    if (options.query) {
      swagger.docs.paths[options.path][options.method].parameters = []
      for (let indexQuery of options.query) {
        swagger.docs.paths[options.path][options.method].parameters.push({
          name: indexQuery.name,
          in: indexQuery.type ?? 'string',
          required: Boolean(indexQuery.required)
        })
      }
    }

    swagger.docs.paths[options.path][options.method].responses = {
      200: {
        description: 'Successfully !!!',
        content: {
          'application/json': {
            schema: {
              type: 'object'
            }
          }
        }
      },
      500: {
        description: 'Server is error !!!',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                data: {
                  type: 'string'
                },
                is_error: {
                  type: 'boolean'
                },
                message: {
                  type: 'string'
                }
              }
            }
          }
        }
      }
    }

    if (Boolean(options.auth)) {
      swagger.docs.paths[options.path][options.method].security = [
        {
          bearerAuth: []
        }
      ]
      swagger.docs.paths[options.path][options.method].responses = {
        ...swagger.docs.paths[options.path][options.method].responses,
        401: {
          $ref: '#/components/responses/UnauthorizedError'
        }
      }
    }
  }),
  swaggerDocuments : () => {
    return {
      openapi: '3.0.3',
      info: {
        title: 'Swagger Nodejs - OpenAPI 3.0',
        version,
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
      ...swagger.docs
    }
  }
}

module.exports= swagger