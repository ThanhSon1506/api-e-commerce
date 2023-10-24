const { Router } = require('express')
const authMiddleware = require('~/middleware/authMiddleware')
const productCategoryController = require('~/controllers/productCategoryController')
const { useTags, usePaths } = require('~/docs/swagger')
const router = Router()

const { verifyToken, verifyAdminAuth } = authMiddleware

// TAG NAME AND PATH PRODUCT CREATE CATEGORY
useTags({
  name: 'Product',
  description: 'Operations related to products'
})

usePaths({
  tag: 'Product',
  summary: 'Create product category',
  path: '/product-category',
  method: 'post',
  requestBody: {
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            title: { type: 'string', example: 'phụ kiện' }
            // Các thuộc tính khác nếu có
          },
          required: ['title']
        }
      }
    }
  },
  responses: {
    201: {
      description: 'Product category created successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' },
              category: {
                type: 'object',
                properties: {
                  // ... (các thuộc tính của danh mục sản phẩm)
                  title: { type: 'string' }
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
  },
  auth: true,
  responseSchema: {
    type: 'object',
    properties: {
      // ... (các thuộc tính của danh mục sản phẩm)
      title: { type: 'string' }
    }
  }
})

// TAG NAME AND PATH PRODUCT GET CATEGORY
useTags({
  name: 'Product',
  description: 'Operations related to products'
})

usePaths({
  tag: 'Product',
  summary: 'Get product categories',
  path: '/product-category',
  method: 'get',
  responses: {
    200: {
      description: 'Product categories retrieved successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' },
              categories: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    // ... (các thuộc tính của danh mục sản phẩm)
                    title: { type: 'string' }
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
  },
  auth: true,
  responseSchema: {
    type: 'object',
    properties: {
      // ... (các thuộc tính của danh mục sản phẩm)
      title: { type: 'string' }
    }
  }
})

// TAG NAME AND PATH PRODUCT UPDATE CATEGORY
useTags({
  name: 'Product',
  description: 'Operations related to products'
})

usePaths({
  tag: 'Product',
  summary: 'Update product category',
  path: '/product-category/{pcid}',
  method: 'put',
  parameters: [
    {
      name: 'pcid', // Tên của tham số
      in: 'path', // Thể hiện nó là một phần của đường dẫn
      description: 'Product category ID',
      required: true, // Có yêu cầu hay không
      schema: {
        type: 'string',
        example: 'your_category_id'
      }
    }
  ],
  requestBody: {
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            // ... (các thuộc tính muốn cập nhật, ví dụ: title)
            title: { type: 'string' }
          },
          required: ['title']
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Product category updated successfully',
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
    },
    404: {
      description: 'Category not found',
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
  },
  auth: true,
  responseSchema: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      message: { type: 'string' }
    }
  }
})
// TAG NAME AND PATH PRODUCT DELETE CATEGORY
useTags({
  name: 'Product',
  description: 'Operations related to products'
})

usePaths({
  tag: 'Product',
  summary: 'Delete product category',
  path: '/product-category/{pcid}',
  method: 'delete',
  parameters: [
    {
      name: 'pcid', // Tên của tham số
      in: 'path', // Thể hiện nó là một phần của đường dẫn
      description: 'Product category ID',
      required: true, // Có yêu cầu hay không
      schema: {
        type: 'string',
        example: 'your_category_id'
      }
    }
  ],
  responses: {
    200: {
      description: 'Product category deleted successfully',
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
    404: {
      description: 'Category not found',
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
  },
  auth: true,
  responseSchema: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      message: { type: 'string' }
    }
  }
})

//=======================CRUD PRODUCT CATEGORY=================================
router.post('/', [verifyToken, verifyAdminAuth], productCategoryController.createCategory)
router.get('/', productCategoryController.getCategory)
router.put('/:pcid', [verifyToken, verifyAdminAuth], productCategoryController.updateCategory)
router.delete('/:pcid', [verifyToken, verifyAdminAuth], productCategoryController.deleteCategory)

module.exports = router