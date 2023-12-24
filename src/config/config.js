const dotenv = require('dotenv')
const Joi = require('joi')

dotenv.config()

const envVarsSchema = Joi.object().keys({
  NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
  HOST_NAME: Joi.string().description('tên máy chủ được phục vụ trên máy chủ'),
  URL_SERVER: Joi.string().description('URL được phục vụ trên máy chủ'),
  URL_CLIENT: Joi.string().description('URL khách hàng trên máy chủ'),

  PORT: Joi.number().default(3000),
  MONGO_DB: Joi.string().required().description('URL MongoDB'),

  JWT_KEY: Joi.string().required().description('Khóa bí mật JWT'),
  JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('số phút sau đó mã thông báo truy cập hết hạn'),
  JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('số ngày sau đó mã thông báo làm mới hết hạn'),
  JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number().default(10).description('số phút sau đó mã thông báo đặt lại mật khẩu hết hạn'),
  JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number().default(10).description('số phút sau đó mã thông báo xác minh email hết hạn'),
  JWT_SECURE: Joi.boolean().default(false).description('Boolean trong JWT an toàn'),

  EMAIL_HOST: Joi.string().description('máy chủ sẽ gửi các email'),
  EMAIL_PORT: Joi.number().description('cổng kết nối đến máy chủ email'),
  EMAIL_NAME: Joi.string().description('tên người dùng cho máy chủ email'),
  EMAIL_APP_PASSWORD: Joi.string().description('mật khẩu cho máy chủ email'),
  EMAIL_FROM: Joi.string().description('trường from trong các email được gửi bởi ứng dụng'),

  LIMIT_PRODUCTS: Joi.number().default(2).description('giới hạn sản phẩm'),

  REDIS_URI: Joi.string().description('URL Redis DB'),
  REDIS_PASSWORD: Joi.string().default('').description('Mật khẩu Redis DB'),
  REDIS_PORT: Joi.string().description('Cổng Redis DB'),
  DAYS_TO_KEEP: Joi.number().default(7).description('Số ngày giữ file trong dự án'),

  CLOUDINARY_NAME: Joi.string().description('tên Cloudinary'),
  CLOUDINARY_KEY: Joi.string().description('khóa Cloudinary'),
  CLOUDINARY_SECRET: Joi.string().description('bí mật Cloudinary')
}).unknown()

const validationResult = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env)
const envVars = validationResult.value
const error = validationResult.error

if (error) {
  throw new Error('Lỗi xác nhận cấu hình: ' + error.message)
}

const config = {
  host: envVars.HOST_NAME,
  url: envVars.URL_SERVER,
  urlClient: envVars.URL_CLIENT,
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  days: envVars.DAYS_TO_KEEP,
  redis: {
    uri: envVars.REDIS_URI,
    pass: envVars.REDIS_PASSWORD,
    port: envVars.REDIS_PORT
  },
  mongoose: {
    url: envVars.MONGO_DB,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },
  jwt: {
    secret: envVars.JWT_KEY,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
    secure: envVars.JWT_SECURE
  },
  email: {
    smtp: {
      host: envVars.EMAIL_HOST,
      port: envVars.EMAIL_PORT,
      secure: true,
      auth: {
        user: envVars.EMAIL_NAME,
        pass: envVars.EMAIL_APP_PASSWORD
      }
    },
    from: envVars.EMAIL_FROM
  },
  cloudinary: {
    cloud_name: envVars.CLOUDINARY_NAME,
    api_key: envVars.CLOUDINARY_KEY,
    api_secret: envVars.CLOUDINARY_SECRET
  }
}

module.exports = config
