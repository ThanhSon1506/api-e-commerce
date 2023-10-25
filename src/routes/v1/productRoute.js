const { Router } = require('express')
const productController = require('~/controllers/productController')
const { useTags, usePaths } = require('~/docs/swagger')
const auth = require('~/middleware/auth')
const validate = require('~/middleware/validate')
const productValidation = require('~/validations/product.validation')
const router = Router()

//======================================CRUD PRODUCT================================
router.post('/', auth('manageUsers'), validate(productValidation.createProduct), productController.createProduct)
router.get('/', validate(productValidation.getProducts), productController.getProducts)
router.put('/ratings', validate(productValidation.ratingProduct), productController.ratingProduct)

router.get('/:pid', validate(productValidation.getProduct), productController.getProduct)
router.put('/:pid', auth('manageUser'), validate(productValidation.updateProduct), productController.updateProduct)
router.delete('/:pid', auth('manageUser'), validate(productController.deleteProduct), productController.deleteProduct)

// TAG NAME AND PATH PRODUCT CREATE
useTags({
  name: 'Product',
  description: 'Operations related to product management'
})

usePaths({
  tag: 'Product',
  summary: 'Create a new product',
  path: '/product',
  method: 'post',
  requestBody: {
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Máy giặt Toshiba' },
        price: { type: 'number', example: 50000 },
        brand: { type: 'string', example: 'Lenovo' },
        description: { type: 'string', example: 'Máy giặt Toshiba' }
        // Add other properties as needed
      },
      required: ['title', 'price', 'brand', 'description']
    }
  },
  responses: {
    201: {
      description: 'Product created successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' }
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
  },
  auth: true, // This endpoint requires authentication
  responseSchema: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      message: { type: 'string' }
    }
  }
})

// TAG NAME AND PATH PRODUCT GET PRODUCTS
useTags({
  name: 'Product',
  description: 'Operations related to product management'
})

usePaths({
  tag: 'Product',
  summary: 'Get a list of products',
  path: '/products',
  method: 'get',
  responses: {
    200: {
      description: 'List of products retrieved successfully',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                price: { type: 'number' },
                brand: { type: 'string' },
                description: { type: 'string' }
                // Add other properties as needed
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
  },
  auth: true, // This endpoint requires authentication
  responseSchema: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        price: { type: 'number' },
        brand: { type: 'string' },
        description: { type: 'string' }
        // Add other properties as needed
      }
    }
  }
})
// TAG NAME AND PATH RATINGS RATING PRODUCT
useTags({
  name: 'Ratings',
  description: 'Operations related to product ratings'
})

usePaths({
  tag: 'Ratings',
  summary: 'Rate a product',
  path: '/ratings',
  method: 'put',
  requestBody: {
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            star: { type: 'number', example: 17 },
            comment: { type: 'string', example: 'Sản phẩm tệ' },
            pid: { type: 'string', example: '652a24fb24ea2dd7f978e02d' }
          },
          required: ['star', 'comment', 'pid']
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Product rated successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' }
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
  },
  auth: true, // This endpoint requires authentication
  responseSchema: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      message: { type: 'string' }
    }
  }
})

// TAG NAME AND PATH PRODUCT GET PRODUCT BY ID
useTags({
  name: 'Product',
  description: 'Operations related to products'
})

usePaths({
  tag: 'Product',
  summary: 'Get product by ID',
  path: '/product/{pid}',
  method: 'get',
  parameters: [
    {
      name: 'pid', // Tên của parameter
      in: 'path', // Thể hiện nó là một phần của đường dẫn (path)
      description: 'ID of the product',
      required: true, // Có yêu cầu hay không
      schema: {
        type: 'string',
        example: '652a24fb24ea2dd7f978e02d'
      }
    }
  ],
  responses: {
    200: {
      description: 'Product retrieved successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object', // Định nghĩa kiểu dữ liệu của response
            properties: {
              // ... (các thuộc tính của sản phẩm)
            }
          }
        }
      }
    },
    404: {
      description: 'Product not found',
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
  },
  auth: false, // Endpoint này không yêu cầu xác thực
  responseSchema: {
    type: 'object',
    properties: {
      // ... (các thuộc tính của sản phẩm)
    }
  }
})

// TAG NAME AND PATH PRODUCT UPDATE PRODUCT BY ID
useTags({
  name: 'Product',
  description: 'Operations related to products'
})

usePaths({
  tag: 'Product',
  summary: 'Update product by ID',
  path: '/product/{pid}',
  method: 'put',
  parameters: [
    {
      name: 'pid', // Tên của parameter
      in: 'path', // Thể hiện nó là một phần của đường dẫn (path)
      description: 'ID of the product',
      required: true, // Có yêu cầu hay không
      schema: {
        type: 'string',
        example: '652a24fb24ea2dd7f978e02d'
      }
    }
  ],
  requestBody: {
    schema: {
      type: 'object', // Định nghĩa kiểu dữ liệu của request body
      properties: {
        title: { type: 'string', example: 'Tủ lạnh Toshiba1' },
        price: { type: 'number' },
        brand: { type: 'string' },
        description: { type: 'string' }
        // Add other properties as needed
      }
    },
    required: true
  },
  responses: {
    200: {
      description: 'Product updated successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object', // Định nghĩa kiểu dữ liệu của response
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' }
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
    },
    404: {
      description: 'Product not found',
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
  },
  auth: true, // Endpoint này yêu cầu xác thực
  responseSchema: {
    type: 'object',
    properties: {
      // ... (các thuộc tính của sản phẩm)
    }
  }
})

// TAG NAME AND PATH PRODUCT DELETE PRODUCT BY ID
useTags({
  name: 'Product',
  description: 'Operations related to products'
})

usePaths({
  tag: 'Product',
  summary: 'Delete product by ID',
  path: '/product/{pid}',
  method: 'delete',
  parameters: [
    {
      name: 'pid', // Tên của parameter
      in: 'path', // Thể hiện nó là một phần của đường dẫn (path)
      description: 'ID of the product',
      required: true, // Có yêu cầu hay không
      schema: {
        type: 'string',
        example: '652a24fb24ea2dd7f978e02d'
      }
    }
  ],
  responses: {
    200: {
      description: 'Product deleted successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object', // Định nghĩa kiểu dữ liệu của response
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' }
            }
          }
        }
      }
    },
    404: {
      description: 'Product not found',
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
  },
  auth: true, // Endpoint này yêu cầu xác thực
  responseSchema: {
    type: 'object',
    properties: {
      // ... (các thuộc tính của sản phẩm)
    }
  }
})


module.exports = router