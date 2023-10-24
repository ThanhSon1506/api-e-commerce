const { Router } = require('express')
const authMiddleware = require('~/middleware/authMiddleware')
const BlogCategoryController = require('~/controllers/blogCategoryController')
const { useTags, usePaths } = require('~/docs/swagger')
const router = Router()

const { verifyToken, verifyAdminAuth } = authMiddleware

//====================CRUD BLOG CATEGORY==================================
router.post('/', [verifyToken, verifyAdminAuth], BlogCategoryController.createCategory)
router.get('/', BlogCategoryController.getCategory)
router.put('/:bcid', [verifyToken, verifyAdminAuth], BlogCategoryController.updateCategory)
router.delete('/:bcid', [verifyToken, verifyAdminAuth], BlogCategoryController.deleteCategory)

// TAG NAME AND PATH BLOG CREATE CATEGORY
useTags({
  name: 'Blog',
  description: 'Operations related to blogs'
})

usePaths({
  tag: 'Blog',
  summary: 'Create blog category',
  path: '/blog-category',
  method: 'post',
  requestBody: {
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Tin Tức' }
        // Add other properties as needed
      },
      required: ['title']
    }
  },
  responses: {
    201: {
      description: 'Blog category created successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' },
              category: {
                type: 'object',
                // Define the structure of the created category
                properties: {
                  // Add properties based on your category structure
                  title: { type: 'string' },
                  categoryId: { type: 'string' }
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
      message: { type: 'string' },
      category: {
        type: 'object',
        // Define the structure of the created category
        properties: {
          // Add properties based on your category structure
          title: { type: 'string' },
          categoryId: { type: 'string' }
        }
      }
    }
  }
})

// TAG NAME AND PATH BLOG GET CATEGORY
useTags({
  name: 'Blog',
  description: 'Operations related to blogs'
})

usePaths({
  tag: 'Blog',
  summary: 'Get all blog categories',
  path: '/blog-category',
  method: 'get',
  responses: {
    200: {
      description: 'Successfully retrieved blog categories',
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
                  // Define the structure of each category
                  properties: {
                    // Add properties based on your category structure
                    title: { type: 'string' },
                    categoryId: { type: 'string' }
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
      success: { type: 'boolean' },
      message: { type: 'string' },
      categories: {
        type: 'array',
        items: {
          type: 'object',
          // Define the structure of each category
          properties: {
            // Add properties based on your category structure
            title: { type: 'string' },
            categoryId: { type: 'string' }
          }
        }
      }
    }
  }
})
// TAG NAME AND PATH BLOG UPDATE CATEGORY
useTags({
  name: 'Blog',
  description: 'Operations related to blogs'
})

usePaths({
  tag: 'Blog',
  summary: 'Update a blog category',
  path: '/blog-category/{bcid}',
  method: 'put',
  parameters: [
    {
      name: 'Authorization', // Tên của header chứa access token
      in: 'header', // Thể hiện nó là một phần của header
      description: 'Access token for authentication',
      required: true, // Có yêu cầu hay không
      schema: {
        type: 'string',
        example: 'Bearer your_access_token'
      }
    },
    {
      name: 'bcid', // Tên của path parameter
      in: 'path', // Thể hiện nó là một path parameter
      description: 'ID of the blog category to update',
      required: true, // Có yêu cầu hay không
      schema: {
        type: 'string',
        example: 'your_category_id'
      }
    }
  ],
  requestBody: {

    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' } // Thêm các thuộc tính khác nếu cần
      }
    }
  },
  responses: {
    200: {
      description: 'Blog category updated successfully',
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
    401: {
      description: 'Unauthorized',
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
      description: 'Blog category not found',
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
// TAG NAME AND PATH BLOG DELETE CATEGORY
useTags({
  name: 'Blog',
  description: 'Operations related to blogs'
})

usePaths({
  tag: 'Blog',
  summary: 'Delete a blog category',
  path: '/blog-category/{bcid}',
  method: 'delete',
  parameters: [
    {
      name: 'Authorization', // Tên của header chứa access token
      in: 'header', // Thể hiện nó là một phần của header
      description: 'Access token for authentication',
      required: true, // Có yêu cầu hay không
      schema: {
        type: 'string',
        example: 'Bearer your_access_token'
      }
    },
    {
      name: 'bcid', // Tên của path parameter
      in: 'path', // Thể hiện nó là một path parameter
      description: 'ID of the blog category to delete',
      required: true, // Có yêu cầu hay không
      schema: {
        type: 'string',
        example: 'your_category_id'
      }
    }
  ],
  responses: {
    200: {
      description: 'Blog category deleted successfully',
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
    401: {
      description: 'Unauthorized',
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
      description: 'Blog category not found',
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


module.exports = router