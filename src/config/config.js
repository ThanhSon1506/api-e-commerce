const dotenv = require('dotenv')
const path = require('path')
const Joi = require('joi')

dotenv.config({ path: path.join(__dirname, '../../.env') })

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    HOST_NAME: Joi.string().description('the host name serve in host'),
    URL_SERVER: Joi.string().description('the url serve in host'),
    URL_CLIENT: Joi.string().description('the url client in host'),
    PORT: Joi.number().default(3000),
    MONGO_DB: Joi.string().required().description('Mongo DB url'),
    MONGO_LOCAL: Joi.string().required().description('Mongo DB url'),
    JWT_KEY: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number().default(10).description('minutes after which reset password token expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number().default(10).description('minutes after which verify email token expires'),
    JWT_SECURE:Joi.boolean().default(false).description('Boolean in jwt secure'),
    EMAIL_HOST: Joi.string().description('server that will send the emails'),
    EMAIL_PORT: Joi.number().description('port to connect to the email server'),
    EMAIL_NAME: Joi.string().description('username for email server'),
    EMAIL_APP_PASSWORD: Joi.string().description('password for email server'),
    EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
    LIMIT_PRODUCTS: Joi.number().default(2).description('limit product'),
    REDIS_URI:Joi.string().description('Redis DB url'),
    REDIS_PASSWORD:Joi.string().description('Redis DB password'),
    REDIS_PORT:Joi.string().description('Redis DB port'),
    DAYS_TO_KEEP:Joi.number().default(7).description('Days to keep file in project'),
    CLOUDINARY_NAME:Joi.string().description('the name cloudinary'),
    CLOUDINARY_KEY:Joi.string().description('the key cloudinary'),
    CLOUDINARY_SECRET:Joi.string().description('the secret cloudinary')
  })
  .unknown()

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env)

if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}

module.exports = {
  host:envVars.HOST_NAME,
  url: envVars.URL_SERVER,
  urlClient:envVars.URL_CLIENT,
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  days: envVars.DAYS_TO_KEEP,
  redis:{
    uri:envVars.REDIS_URI,
    pass:envVars.REDIS_PASSWORD,
    port:envVars.REDIS_PORT
  },
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    url_local:envVars.MONGO_LOCAL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
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
    secure:envVars.JWT_SECURE
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
  cloudinary:{
    cloud_name:envVars.CLOUDINARY_NAME,
    api_key:envVars.CLOUDINARY_KEY,
    api_secret:envVars.CLOUDINARY_SECRET
  }
}