const { Router } = require('express')
const blogController = require('~/controllers/blogController')
const { usePaths, useTags } = require('~/docs/swagger')
const auth = require('~/middleware/auth')
const router = Router()
const authMiddleware =require('~/middleware/authMiddleware')
const { verifyToken } =authMiddleware
//===========================CRUD BLOG==========================
router
  .route('/')
  .get(blogController.getBlogs)
  .post( auth('manageBlogs'), blogController.createBlog)
router.put('/like/:bid', verifyToken, blogController.likeBlog)
router.put('/dislike/:bid', verifyToken, blogController.disLikeBlog)
router
  .route('/:bid')
  .put( auth('manageBlogs'), blogController.updateBlog)
  .delete(auth('manageBlogs'), blogController.deleteBlog)
  .get(blogController.getBlog)

module.exports = router


// TAG NAME AND PATH BLOG CREATE POST
useTags({
  name: 'Blog',
  description: 'Operations related to blogs'
})
usePaths({
  tag: 'Blog',
  summary: 'Create a blog post',
  path: '/blog',
  method: 'post',
  requestBody: {
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Bell pepper' },
        description: { type: 'string', example: 'Description vegetables Bell pepper' },
        category: { type: 'string', example: 'vegetables' }
        // Add other properties as needed
      },
      required: ['title', 'description', 'category']
    }
  },
  responses: {
    201: {
      description: 'Blog post created successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' },
              post: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string' },
                  category: { type: 'string' },
                  postId: { type: 'string' }
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
      post: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          category: { type: 'string' },
          postId: { type: 'string' }
        }
      }
    }
  }
})

// TAG NAME AND PATH BLOG GET POSTS
useTags({
  name: 'Blog',
  description: 'Operations related to blogs'
})
usePaths({
  tag: 'Blog',
  summary: 'Get all blog posts',
  path: '/blog',
  method: 'get',
  responses: {
    200: {
      description: 'Successfully retrieved blog posts',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' },
              posts: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    description: { type: 'string' },
                    category: { type: 'string' },
                    postId: { type: 'string' }
                  }
                }
              }
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
      posts: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            description: { type: 'string' },
            category: { type: 'string' },
            postId: { type: 'string' }
          }
        }
      }
    }
  }
})

// TAG NAME AND PATH BLOG UPDATE POST
useTags({
  name: 'Blog',
  description: 'Operations related to blogs'
})
usePaths({
  tag: 'Blog',
  summary: 'Update a blog post',
  path: '/blog/{bid}',
  method: 'put',
  parameters: [
    {
      name: 'Authorization',
      in: 'header',
      description: 'Access token for authentication',
      required: true,
      schema: {
        type: 'string',
        example: 'Bearer your_access_token'
      }
    },
    {
      name: 'bid',
      in: 'path',
      description: 'ID of the blog post to update',
      required: true,
      schema: {
        type: 'string',
        example: 'your_blog_id'
      }
    }
  ],
  requestBody: {
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        category: { type: 'string' }
        // Add other properties as needed
      }
    }
  },
  responses: {
    200: {
      description: 'Blog post updated successfully',
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
      description: 'Blog post not found',
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
      message: { type: 'string' }
    }
  }
})

// TAG NAME AND PATH BLOG DELETE POST
useTags({
  name: 'Blog',
  description: 'Operations related to blogs'
})
usePaths({
  tag: 'Blog',
  summary: 'Delete a blog post',
  path: '/blog/{bid}',
  method: 'delete',
  parameters: [
    {
      name: 'Authorization',
      in: 'header',
      description: 'Access token for authentication',
      required: true,
      schema: {
        type: 'string',
        example: 'Bearer your_access_token'
      }
    },
    {
      name: 'bid',
      in: 'path',
      description: 'ID of the blog post to delete',
      required: true,
      schema: {
        type: 'string',
        example: 'your_blog_id'
      }
    }
  ],
  responses: {
    200: {
      description: 'Blog post deleted successfully',
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
      description: 'Blog post not found',
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
      message: { type: 'string' }
    }
  }
})

// TAG NAME AND PATH BLOG GET POST BY ID
useTags({
  name: 'Blog',
  description: 'Operations related to blogs'
})
usePaths({
  tag: 'Blog',
  summary: 'Get a blog post by ID',
  path: '/blog/{bid}',
  method: 'get',
  parameters: [
    {
      name: 'bid',
      in: 'path',
      description: 'ID of the blog post to retrieve',
      required: true,
      schema: {
        type: 'string',
        example: 'your_blog_id'
      }
    }
  ],
  responses: {
    200: {
      description: 'Successfully retrieved blog post',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' },
              post: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string' },
                  category: { type: 'string' },
                  postId: { type: 'string' }
                }
              }
            }
          }
        }
      }
    },
    404: {
      description: 'Blog post not found',
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
      post: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          category: { type: 'string' },
          postId: { type: 'string' }
        }
      }
    }
  }
})
