const { Router } = require('express')
const authController = require('~/controllers/authController')
const { verifyRefreshToken, verifyToken } = require('~/middleware/authMiddleware')
const validate = require('~/middleware/validate')
const { authValidation } = require('~/validations')
const { useTags, usePaths } =require('~/docs/swagger')
const router = Router()


// =================================ROUTER====================================================
router.post('/register', validate(authValidation.register), authController.postRegister)
router.post('/login', validate(authValidation.login), authController.postLogin)
router.post('/refresh', verifyRefreshToken, authController.requestRefreshToken)
router.post('/logout', verifyToken, authController.userLogout)
router.post('/forgot-password', validate(authValidation.forgotPassword), authController.forgotPassword)
router.put('/reset-password', validate(authValidation.resetPassword), authController.resetPassword)
router.post('/email-verification', verifyToken, authController.sendVerificationEmail)
router.put('/email-confirmation', authController.verifyEmail)
module.exports = router

// TAG NAME AND PATH USER LOGIN
useTags({
  name: 'Auth',
  description: 'Operations related to user management'
})
usePaths({
  tag: 'Auth',
  summary: 'Login form user',
  path: '/auth/login',
  method: 'post',
  requestBody: {
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'admin@gmail.com' },
        password: { type: 'string', example: 'admin@123456' }
      },
      required: ['email', 'password']
    }
  },
  responses: {
    200: {
      description: 'Login successful',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              token: { type: 'string' },
              user: { type: 'object' }
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
      email: { type: 'string', example: 'admin@gmail.com' },
      password : { type: 'string', example: 'admin@123456' }
    }
  }
})
// TAG NAME AND PATH USER REGISTER
useTags({
  name: 'Auth',
  description: 'Operations related to user management'
})

usePaths({
  tag: 'Auth',
  summary: 'User registration',
  path: '/auth/register',
  method: 'post',
  requestBody: {
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'test@gmail.com' },
        lastName: { type: 'string', example: 'A' },
        firstName: { type: 'string', example: 'cumque' },
        password: { type: 'string', example: 'test@123456' },
        mobile: { type: 'string', example: '1234561789654' }
      },
      required: ['email', 'lastName', 'firstName', 'password', 'mobile']
    }
  },
  responses: {
    200: {
      description: 'Registration successful',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              token: { type: 'string' },
              user: { type: 'object' }
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
      email: { type: 'string', example: 'test@gmail.com' },
      lastName: { type: 'string', example: 'A' },
      firstName: { type: 'string', example: 'cumque' },
      password: { type: 'string', example: 'test@123456' },
      mobile: { type: 'string', example: '1234561789654' }
    }
  }
})

// TAG NAME AND PATH USER Refresh
useTags({
  name: 'Auth',
  description: 'Operations related to user management'
})
usePaths({
  tag: 'Auth',
  summary: 'Refresh access token',
  path: '/auth/refresh',
  method: 'post',
  parameters: [
    {
      name: 'Cookie', // Tên của cookie
      in: 'header', // Thể hiện nó là một phần của header
      description: 'Cookie containing the refresh token',
      required: true, // Có yêu cầu hay không
      schema: {
        type: 'string',
        example:'your_refresh_token'
      }
    }
  ],
  responses: {
    200: {
      description: 'Token refreshed successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              newAccessToken: { type: 'string' },
              newRefreshToken: { type: 'string' }
            }
          }
        }
      }
    },
    401: {
      description: 'Invalid or expired refresh token',
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
    type: 'string',
    example: 'Token refreshed successfully'
  }
})

// TAG NAME AND PATH USER Logout
useTags({
  name: 'Auth',
  description: 'Operations related to user management'
})
usePaths({
  tag: 'Auth',
  summary: 'Logout user',
  path: '/auth/logout',
  method: 'post',
  query: [
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
      description: 'Logout successful',
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
// TAG NAME AND PATH USER Forgot Password
useTags({
  name: 'Auth',
  description: 'Operations related to user management'
})

usePaths({
  tag: 'Auth',
  summary: 'Forgot password',
  path: '/auth/forgot-password',
  method: 'post',
  requestBody: {
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            email: { type: 'string', example: 'user@example.com' }
          },
          required: ['email']
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Password reset instructions sent successfully',
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

// TAG NAME AND PATH USER Reset Password
useTags({
  name: 'Auth',
  description: 'Operations related to user management'
})

usePaths({
  tag: 'Auth',
  summary: 'Reset password',
  path: '/auth/reset-password',
  method: 'put',
  requestBody: {
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            resetToken: { type: 'string', example: 'your_reset_token' },
            newPassword: { type: 'string', example: 'new_password' }
          },
          required: ['resetToken', 'newPassword']
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Password reset successfully',
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

// TAG NAME AND PATH USER Email Verification
useTags({
  name: 'Auth',
  description: 'Operations related to user management'
})

usePaths({
  tag: 'Auth',
  summary: 'Email verification',
  path: '/auth/email-verification',
  method: 'post',
  requestBody: {
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        verificationToken: { type: 'string', example: 'your_verification_token' }
      },
      required: ['email', 'verificationToken']
    }
  },
  responses: {
    200: {
      description: 'Email verification successful',
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

// TAG NAME AND PATH USER Email Confirmation
useTags({
  name: 'Auth',
  description: 'Operations related to user management'
})

usePaths({
  tag: 'Auth',
  summary: 'Email confirmation',
  path: '/auth/email-confirmation',
  method: 'put',
  requestBody: {
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        confirmationCode: { type: 'string', example: 'your_confirmation_code' }
      },
      required: ['email', 'confirmationCode']
    }
  },
  responses: {
    200: {
      description: 'Email confirmation successful',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          message: { type: 'string' }
        }
      }
    },
    400: {
      description: 'Bad request',
      schema: {
        type: 'object',
        properties: {
          error: { type: 'string' },
          message: { type: 'string' }
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

