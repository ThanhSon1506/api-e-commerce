import User from '~/models/User'
import expressAsyncHandler from 'express-async-handler'
import httpStatus from 'http-status'
import ApiError from '~/utils/ApiError'
const userService = {
  /**
 * Create uer
 * @param {string} userBody
 * @returns {Promise<User>}
 */
  createUser : expressAsyncHandler( async (userBody) => {
    if (await User.isEmailTaken(userBody.email)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken')
    }
    return User.create(userBody)
  }),
  /**
 * Get info user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
  getUserByEmail : expressAsyncHandler(async (email) => {
    return User.findOne({ email })
  }),
  /**
 * Get info user by id
 * @param {string} id
 * @returns {Promise<User>}
 */
  getUserById:expressAsyncHandler(async(id) => {
    return User.findById(id).select('-refreshToken -password -role')
  }),
  /**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
  updateUserById : expressAsyncHandler(async (userId, updateBody) => {
    const user = await userService.getUserById(userId)
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
    }
    if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken')
    }
    Object.assign(user, updateBody)
    await user.save()
    return user
  }),
  /**
 * Get all users
 * @returns {Promise<User>}
 */
  getAllUsers : expressAsyncHandler(async () => {
    return User.find().select('-refreshToken -password -role')
  }),

  /**
 * Delete user by idza
 * @param {String} uid
 * @returns {Promise<User>}
 */
  deleteUserById : expressAsyncHandler(async (userId) => {
    return User.findByIdAndDelete(userId)
  }),
  /**
 * update user by id
 * @param {String} uid
 * @returns {Promise<User>}
 */
  updateUserByAdmin: expressAsyncHandler(async (req, res) => {
    const { uid } = req.user
    if (Object.keys(req.body).length === 0) throw new Error('Missing input')
    const response = await User.findByIdAndUpdate(uid, req.body, { new: true }).select('-password -role -refreshToken')
    return res.status(200).json({
      success: response ? true : false,
      updateUser: response ? response : 'Some thing went wrong'
    })
  })

}

module.exports = userService