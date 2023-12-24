const User = require('~/models/User.js')
const expressAsyncHandler = require('express-async-handler')
const httpStatus = require('http-status')
const ApiError = require('~/utils/ApiError')

const userService = {
  /**
   * Create user
   * @param {string} userBody
   * @returns {Promise<User>}
   */
  createUser: expressAsyncHandler(async function (userBody) {
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
  getUserByEmail: expressAsyncHandler(async function (email) {
    return User.findOne({ email: email })
  }),

  /**
   * Get info user by id
   * @param {string} id
   * @returns {Promise<User>}
   */
  getUserById: expressAsyncHandler(async function (id) {
    return await User.findById(id).select('-refreshToken -password -role')
  }),

  /**
   * Update user by id
   * @param {ObjectId} userId
   * @param {Object} updateBody
   * @returns {Promise<User>}
   */
  updateUserById: expressAsyncHandler(async function (userId, updateBody) {
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
  getAllUsers: expressAsyncHandler(async function () {
    return User.find().select('-refreshToken -password -role')
  }),

  /**
   * Delete user by id
   * @param {String} uid
   * @returns {Promise<User>}
   */
  deleteUserById: expressAsyncHandler(async function (userId) {
    return User.findByIdAndDelete(userId)
  }),

  /**
   * Update user by id
   * @param {String} uid
   * @returns {Promise<User>}
   */
  updateUserByAdmin: expressAsyncHandler(async function (req, res) {
    const uid = req.user.uid
    if (Object.keys(req.body).length === 0) throw new Error('Missing input')
    const response = await User.findByIdAndUpdate(uid, req.body, { new: true }).select('-password -role -refreshToken')
    return res.status(200).json({
      success: response ? true : false,
      updateUser: response ? response : 'Something went wrong'
    })
  }),

  /**
   * Query for blog Categories
   * @param {Object} filter - Mongo filter
   * @param {Object} options - Query options
   * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
   * @param {number} [options.limit] - Maximum number of results per page (default = 10)
   * @param {number} [options.page] - Current page (default = 1)
   * @returns {Promise<QueryResult>}
   */
  queryUsers: async function (filter, options) {
    const user = await User.paginate(filter, options)
    return user
  },

  /**
   * Verify email
   * @param {string} promoteUserToAdmin
   * @returns {Promise}
   */
  promoteUserToAdmin: expressAsyncHandler(async function (userId) {
    const user = await userService.getUserById(userId)
    if (!user) {
      throw new Error()
    }
    user.role = 'admin'
    await user.save()
    return user
  })
}

module.exports = userService
