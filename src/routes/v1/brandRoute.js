const { Router } = require('express')
const brandController = require('~/controllers/brandController')
const { useTags, usePaths } = require('~/docs/swagger')
const auth = require('~/middleware/auth')
const validate = require('~/middleware/validate')
const brandValidation = require('~/validations/brand.validation')
const router = Router()

//=======================CRUD BRAND=================================
router.
  route('/')
  .post( auth('manageBrands'), validate(brandValidation.createBrand), brandController.createBrand)
  .get( validate('getBrands'), brandController.getBrands)
router
  .route('/:brandId')
  .get(validate('getBrand'), brandController.getBrand)
  .put( auth('manageBrands'), brandController.updateBrand)
  .delete(auth('manageBrands'), brandController.deleteBrand)
// TAG NAME AND PATH BRAND CREATE
useTags({
  name: 'Brand',
  description: 'Operations related to brands'
})

usePaths({
  tag: 'Brand',
  summary: 'Create a new brand',
  path: '/brand',
  method: 'post',
  requestBody: {
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Your Brand Name' }
        // Add other properties as needed for the brand
      },
      required: ['title']
    }
  },
  responses: {
    201: {
      description: 'Brand created successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' },
              brand: {
                type: 'object',
                properties: {
                  title: { type: 'string' }
                  // Add other properties of the brand
                }
              }
            }
          }
        }
      }
    },
    400: {
      description: 'Bad request',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              error: { type: 'string' },
              message: { type: 'string' }
            }
          }
        }
      }
    }
    // ... (other response codes)
  },
  auth: true,
  responseSchema: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      message: { type: 'string' },
      brand: {
        type: 'object',
        properties: {
          title: { type: 'string' }
          // Add other properties of the brand
        }
      }
    }
  }
})
// TAG NAME AND PATH BRAND GET ALL
useTags({
  name: 'Brand',
  description: 'Operations related to brands'
})

usePaths({
  tag: 'Brand',
  summary: 'Get all brands',
  path: '/brands',
  method: 'get',
  responses: {
    200: {
      description: 'Brands retrieved successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' },
              brands: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' }
                    // Add other properties of the brand
                  }
                }
              }
            }
          }
        }
      }
    },
    500: {
      description: 'Internal server error',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              error: { type: 'string' },
              message: { type: 'string' }
            }
          }
        }
      }
    }
    // ... (other response codes)
  },
  auth: true,
  responseSchema: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      message: { type: 'string' },
      brands: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            title: { type: 'string' }
            // Add other properties of the brand
          }
        }
      }
    }
  }
})

// TAG NAME AND PATH BRAND GET BY ID
useTags({
  name: 'Brand',
  description: 'Operations related to brands'
})

usePaths({
  tag: 'Brand',
  summary: 'Get a brand by ID',
  path: '/brand/{brandId}',
  method: 'get',
  parameters: [
    {
      name: 'brandId',
      in: 'path',
      description: 'ID of the brand to retrieve',
      required: true,
      schema: {
        type: 'string'
        // Add any additional validation for brandId if needed
      }
    }
  ],
  responses: {
    200: {
      description: 'Brand retrieved successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' },
              brand: {
                type: 'object',
                properties: {
                  title: { type: 'string' }
                  // Add other properties of the brand
                }
              }
            }
          }
        }
      }
    },
    404: {
      description: 'Brand not found',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              error: { type: 'string' },
              message: { type: 'string' }
            }
          }
        }
      }
    },
    500: {
      description: 'Internal server error',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              error: { type: 'string' },
              message: { type: 'string' }
            }
          }
        }
      }
    }
    // ... (other response codes)
  },
  auth: true,
  responseSchema: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      message: { type: 'string' },
      brand: {
        type: 'object',
        properties: {
          title: { type: 'string' }
          // Add other properties of the brand
        }
      }
    }
  }
})

// TAG NAME AND PATH BRAND DELETE
useTags({
  name: 'Brand',
  description: 'Operations related to brands'
})

usePaths({
  tag: 'Brand',
  summary: 'Delete a brand',
  path: '/brands/{brandId}',
  method: 'delete',
  parameters: [
    {
      name: 'brandId',
      in: 'path',
      description: 'ID of the brand to delete',
      required: true,
      schema: {
        type: 'string'
        // Add any additional validation for brandId if needed
      }
    }
  ],
  responses: {
    200: {
      description: 'Brand deleted successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' },
              brand: {
                type: 'object',
                properties: {
                  title: { type: 'string' }
                  // Add other properties of the brand
                }
              }
            }
          }
        }
      }
    },
    404: {
      description: 'Brand not found',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              error: { type: 'string' },
              message: { type: 'string' }
            }
          }
        }
      }
    },
    500: {
      description: 'Internal server error',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              error: { type: 'string' },
              message: { type: 'string' }
            }
          }
        }
      }
    }
    // ... (other response codes)
  },
  auth: true,
  responseSchema: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      message: { type: 'string' },
      brand: {
        type: 'object',
        properties: {
          title: { type: 'string' }
          // Add other properties of the brand
        }
      }
    }
  }
})

module.exports = router