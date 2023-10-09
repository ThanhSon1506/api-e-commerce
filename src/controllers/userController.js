import User from '~/models/User'
import expressAsyncHandler from 'express-async-handler'
import sendMail from '~/utils/sendEmail'
import crypto from 'crypto'
const userController = {
  // Get All users
  getAllUsers: expressAsyncHandler(async (req, res) => {
    const user = await User.find().select('-refreshToken -password -role')
    return res.status(200).json({
      success: user ? true : false,
      users: user
    })
  }),
  getCurrent: expressAsyncHandler(async (req, res) => {
    const { id } = req.user
    const user = await User.findById(id).select('-refreshToken -password -role')
    return res.status(200).json({
      success: false,
      message: user ? user : 'User not found'
    })
  }),
  deleteUser: expressAsyncHandler(async (req, res) => {
    const { id } = req.query
    if (!id) throw new Error('Missing inputs')
    const response = await User.findByIdAndDelete(id)
    return res.status(200).json(
      {
        success: response ? true : false,
        deleteUser: response ? `User with email ${response.email} deleted` : 'No user delete'
      }
    )
  }),
  updateUser: expressAsyncHandler(async (req, res) => {
    const { id } = req.user
    if (!id || Object.keys(req.body).length === 0) throw new Error('Missing input')
    const response = await User.findByIdAndUpdate(id, req.body, { new: true }).select('-password -role -refreshToken')
    return res.status(200).json({
      success: response ? true : false,
      updateUser: response ? response : 'Some thing went wrong'
    })
  }),
  updateUserByAdmin: expressAsyncHandler(async (req, res) => {
    const { uid } = req.user
    if (Object.keys(req.body).length === 0) throw new Error('Missing input')
    const response = await User.findByIdAndUpdate(uid, req.body, { new: true }).select('-password -role -refreshToken')
    return res.status(200).json({
      success: response ? true : false,
      updateUser: response ? response : 'Some thing went wrong'
    })
  }),
  /**
        * Client gửi email
        * Serve check email có hợp lệ hay không => gửi mail + kèm theo link (password change token)
        * Client check email => click link
        * Client gửi api kèm token
        * Check token có giống với token mà serve gửi email hay không
        * Change password
        * */

  forgotPassword: expressAsyncHandler(async (req, res) => {
    const { email } = req.query
    if (!email) throw new Error('Missing email')
    const user = await User.findOne({ email })
    if (!user) throw new Error('User not found')
    const resetToken = await user.createPasswordChangedToken()
    await user.save()
    const html = `Xin vui lòng click vào link dưới đây để thay đổi mật khẩu của bạn. Link này sẽ hết hạn sau 15 phút kể từ bây giờ. 
        <a href=${process.env.URL_SERVER}/v1/user/reset/${resetToken}>Click here</a>`

    const data = {
      email,
      html
    }
    const result = await sendMail(data)
    return res.status(200).json({
      success: true,
      result

    })
  }),

  resetPassword: expressAsyncHandler(async (req, res) => {
    const { password, token } = req.body
    if (!password || !token) throw new Error('Missing inputs')
    const passwordResetToken = crypto.createHash('sha256').update(token).digest('hex')
    const user = await User.findOne({ passwordResetToken, passwordResetExpires: { $gt: Date.now() } })
    if (!user) throw new Error('Invalid reset token')
    user.password = password
    user.passwordResetToken = undefined
    user.passwordChangeAt = Date.now()
    user.passwordResetExpires = undefined
    await user.save()
    return res.status(200).json({
      success: user ? true : false,
      message: user ? 'Update password' : 'Something went wrong'
    })
  })
}

module.exports = userController