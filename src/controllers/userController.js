import expressAsyncHandler from 'express-async-handler'
import { userService } from '~/services'
import ApiError from '~/utils/ApiError'
import httpStatus from 'http-status'

const userController = {
  getAllUsers: expressAsyncHandler(async (req, res) => {
    const user =await userService.getAllUsers()
    return res.status(200).json({
      success: user ? true : false,
      users: user
    })
  }),
  getCurrent: expressAsyncHandler(async (req, res) => {
    const { sub } = req.user
    const userCurrent = await userService.getUserById(sub)
    return res.status(200).json({
      success:userCurrent ?true: false,
      message: userCurrent ? userCurrent : 'User not found'
    })
  }),
  deleteUser: expressAsyncHandler(async (req, res) => {
    const { uid } = req.params
    if (!uid) throw new ApiError(httpStatus.BAD_REQUEST, 'Missing input')
    const response = await userService.deleteUserById(uid)
    return res.status(200).json(
      {
        success: response ? true : false,
        deleteUser: response ? `User with email ${response.email} deleted` : 'No user delete'
      }
    )
  }),
  updateUser: expressAsyncHandler(async (req, res) => {
    const { sub:uid } = req.user
    if (!uid || Object.keys(req.body).length === 0) throw new Error('Missing input')
    const response = await userService.updateUserById(uid, req.body)
    return res.status(200).json({
      success: response ? true : false,
      updateUser: response ? response : 'Some thing went wrong'
    })
  }),
  updateUserByAdmin: expressAsyncHandler(async (req, res) => {
    const { uid } = req.params
    if (Object.keys(req.body).length === 0) throw new Error('Missing input')
    const response = await userService.updateUserById(uid, req.body)
    return res.status(200).json({
      success: response ? true : false,
      updateUser: response ? response : 'Some thing went wrong'
    })
  })

}

module.exports = userController