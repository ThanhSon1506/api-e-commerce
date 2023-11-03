const express = require('express')
const userController = require('~/controllers/userController')
const { useTags, usePaths } = require('~/docs/swagger')
const auth = require('~/middleware/auth')
const validate = require('~/middleware/validate')
const userValidation = require('~/validations/user.validation')
const router = express.Router()

//============================CRUD user===============================
router
  .route('/')
  .post(auth('manageUsers'), validate(userValidation.createUser), userController.createUser)
  .get(auth('getUsers'), validate(userValidation.getUsers), userController.getAllUsers)

router
  .route('/current')
  .get( auth(), userController.getCurrent)
  .put( auth(), userController.updateUser)

router.put('/promote/:uid', auth('manageUsers'), validate(userValidation.promoteUser), userController.promoteUserToAdmin)
router
  .route('/:uid')
  .delete( auth('manageUsers'), validate(userValidation.deleteUser), userController.deleteUser)
  .put( auth('manageUsers'), validate(userValidation.updateUser), userController.updateUser)
module.exports = router

// TAG NAME AND PATH USER CREATE
useTags({
  name: 'User',
  description: 'Operations related to user management'
})

usePaths({
  tag: 'User',
  summary: 'Create a new user',
  path: '/auth/user',
  method: 'post',
  requestBody: {
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'test1@gmail.com' },
        password: { type: 'string', example: '123456789' },
        firstName: { type: 'string', example: 'cumque' },
        lastName: { type: 'string', example: 'test' },
        mobile: { type: 'string', example: '456789' }
        // Add other properties as needed
      },
      required: ['email', 'password', 'firstName', 'lastName', 'mobile']
    }
  },
  responses: {
    200: {
      description: 'User created successfully',
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
  auth: false,
  responseSchema: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      message: { type: 'string' }
    }
  }
})

// TAG NAME AND PATH USER GET ALL USERS
useTags({
  name: 'User',
  description: 'Operations related to user management'
})

usePaths({
  tag: 'User',
  summary: 'Get all users',
  path: '/auth/user',
  method: 'get',
  responses: {
    200: {
      description: 'List of all users',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              users: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    email: { type: 'string' },
                    firstName: { type: 'string' },
                    lastName: { type: 'string' },
                    mobile: { type: 'string' }
                    // Add other properties as needed
                  }
                }
              }
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
// TAG NAME AND PATH USER Get Current User
useTags({
  name: 'User',
  description: 'Operations related to user management'
})

usePaths({
  tag: 'User',
  summary: 'Get current user information',
  path: '/auth/current',
  method: 'get',
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
    }
  ],
  responses: {
    200: {
      description: 'User information retrieved successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              email: { type: 'string' },
              firstName: { type: 'string' },
              lastName: { type: 'string' },
              mobile: { type: 'string' }
              // Add other properties as needed
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

// TAG NAME AND PATH USER UPDATE CURRENT USER
useTags({
  name: 'User',
  description: 'Operations related to user management'
})

usePaths({
  tag: 'User',
  summary: 'Update current user information',
  path: '/auth/current',
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
    }
  ],
  requestBody: {
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            mobile: { type: 'string' }
            // Add other properties as needed
          }
        }
      }
    }
  },
  responses: {
    200: {
      description: 'User information updated successfully',
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

// TAG NAME AND PATH USER Promote USER TO ADMIN
useTags({
  name: 'User',
  description: 'Operations related to user management'
})

usePaths({
  tag: 'User',
  summary: 'Promote user to admin',
  path: '/promote/:uid',
  method: 'put',
  parameters: [
    {
      name: 'uid',
      in: 'path',
      description: 'User ID to be promoted',
      required: true,
      schema: {
        type: 'string',
        example: 'user_id_here'
      }
    },
    {
      name: 'Authorization',
      in: 'header',
      description: 'Access token for authentication',
      required: true,
      schema: {
        type: 'string',
        example: 'Bearer your_access_token'
      }
    }
  ],
  responses: {
    200: {
      description: 'User promoted to admin successfully',
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

// TAG NAME AND PATH USER DELETE USER
useTags({
  name: 'User',
  description: 'Operations related to user management'
})

usePaths({
  tag: 'User',
  summary: 'Delete user',
  path: '/:uid',
  method: 'delete',
  parameters: [
    {
      name: 'uid',
      in: 'path',
      description: 'User ID to be deleted',
      required: true,
      schema: {
        type: 'string',
        example: 'user_id_here'
      }
    },
    {
      name: 'Authorization',
      in: 'header',
      description: 'Access token for authentication',
      required: true,
      schema: {
        type: 'string',
        example: 'Bearer your_access_token'
      }
    }
  ],
  responses: {
    200: {
      description: 'User deleted successfully',
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
// TAG NAME AND PATH USER UPDATE USER
useTags({
  name: 'User',
  description: 'Operations related to user management'
})

usePaths({
  tag: 'User',
  summary: 'Update user information',
  path: '/:uid',
  method: 'put',
  parameters: [
    {
      name: 'uid',
      in: 'path',
      description: 'User ID to be updated',
      required: true,
      schema: {
        type: 'string',
        example: 'user_id_here'
      }
    },
    {
      name: 'Authorization',
      in: 'header',
      description: 'Access token for authentication',
      required: true,
      schema: {
        type: 'string',
        example: 'Bearer your_access_token'
      }
    }
  ],
  requestBody: {
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            mobile: { type: 'string' }
            // Add other properties as needed
          }
        }
      }
    }
  },
  responses: {
    200: {
      description: 'User information updated successfully',
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

