import nodemailer from 'nodemailer'
import config from '~/config/config'
import logger from '~/config/logger'

const emailService = {
  transport: nodemailer.createTransport(config.email.smtp),

  /**
   * Send an email
   * @param {string} to
   * @param {string} subject
   * @param {string} text
   * @returns {Promise}
   */
  sendEmail: async (to, subject, text, attachmentData = null) => {
    const msg = {
      from: config.email.from,
      to,
      subject,
      text,
      attachments: attachmentData
        ? [
          {
            filename: 'exported_data.zip',
            content: attachmentData,
            encoding: 'base64'
          }
        ]
        : []
    }
    await emailService.transport.sendMail(msg)
  },

  /**
   * Send reset password email
   * @param {string} to
   * @param {string} resetToken
   * @returns {Promise}
   */
  sendResetPasswordEmail: async (to, resetToken) => {
    const subject = 'Reset password'
    // replace this url with the link to the reset password page of your front-end app
    const resetPasswordUrl = `${config.url}/v1/auth/reset/${resetToken}`
    const text = `Dear user,
    To reset your password, click on this link: ${resetPasswordUrl}
    If you did not request any password resets, then ignore this email.`
    await emailService.sendEmail(to, subject, text)
  },

  /**
   * Send verification email
   * @param {string} to
   * @param {string} token
   * @returns {Promise}
   */
  sendVerificationEmail: async (to, token) => {
    const subject = 'Email Verification'
    // replace this url with the link to the email verification page of your front-end app
    const verificationEmailUrl = `${config.url}/v1/auth/verify-email?token=${token}`
    const text = `Dear user,
    To verify your email, click on this link: ${verificationEmailUrl}
    If you did not create an account, then ignore this email.`
    await emailService.sendEmail(to, subject, text)
  },

  /**
   * Send database daily email
   * @param {string} to
   * @param {string} attachmentData
   * @returns {Promise}
   */
  sendDatabaseDaily: async (to, attachmentData) => {
    // Gửi email với dữ liệu đính kèm
    const subject = 'Export Database Notification'
    const text = 'The database export process has completed successfully.'
    await emailService.sendEmail(to, subject, text, attachmentData)
    logger.info('send email success')
  }
}

export default emailService
