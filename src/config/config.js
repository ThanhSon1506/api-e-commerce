const dotenv = require('dotenv')
const path = require('path')
const Joi = require('joi')

dotenv.config({ path: path.join(__dirname, '../../.env') })

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    MONGO_DB: Joi.string().required().description('Mongo DB url'),
    MONGO_LOCAL: Joi.string().required().description('Mongo DB url'),
    JWT_ACCESS_KEY: Joi.string().required().description('JWT secret key'),
    JWT_REFRESH_KEY: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_TIME: Joi.string().default('2h').description('minutes after which access tokens expire'),
    JWT_REFRESH_TIME: Joi.string().default('30d').description('days after which refresh tokens expire'),
    SMTP_HOST: Joi.string().description('server that will send the emails'),
    SMTP_PORT: Joi.number().description('port to connect to the email server'),
    EMAIL_NAME: Joi.string().description('username for email server'),
    EMAIL_APP_PASSWORD: Joi.string().description('password for email server'),
    EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
    LIMIT_PRODUCTS: Joi.number().default(2).description('limit product')

  })
  .unknown()

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env)

if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}

module.exports = {
  port: envVars.PORT,
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    url_local:envVars.MONGO_LOCAL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },
  jwt: {
    access: envVars.JWT_ACCESS_KEY,
    refresh: envVars.JWT_REFRESH_KEY,
    accessExpirationMinutes: envVars.JWT_ACCESS_TIME,
    refreshExpirationDays: envVars.JWT_REFRESH_TIME
  },
  email: {
    smtp: {
      host: envVars.EMAIL_HOST,
      port: envVars.EMAIL_PORT,
      auth: {
        user: envVars.EMAIL_NAME,
        pass: envVars.EMAIL_APP_PASSWORD
      }
    },
    from: envVars.EMAIL_FROM
  }
}