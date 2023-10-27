import expressAsyncHandler from 'express-async-handler'
import { userService } from '~/services'
import httpStatus from 'http-status'
import pick from '~/utils/pick'

const userController = {
  createUser:expressAsyncHandler(async(req, res) => {
    const user = await userService.createUser(req.body)
    res.status(httpStatus.CREATED).send(user)
  }),
  getAllUsers: expressAsyncHandler(async (req, res) => {
    const filter = pick(req.query, ['title', 'role'])
    const options= pick(req.query, ['sortBy', 'limit', 'page', 'fields', 'populate'])
    if (!('fields' in options)) {
      options.fields='-password -role'
    }
    const result = await userService.queryUsers(filter, options)
    // eslint-disable-next-line no-unused-vars
    return res.status(200).json({
      success: result ? true : false,
      users: result
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
    const response = await userService.updateUserById(uid, req.body)
    return res.status(200).json({
      success: response ? true : false,
      updateUser: response ? response : 'Some thing went wrong'
    })
  }),
  updateUserByAdmin: expressAsyncHandler(async (req, res) => {
    const { uid } = req.params
    const response = await userService.updateUserById(uid, req.body)
    return res.status(200).json({
      success: response ? true : false,
      updateUser: response ? response : 'Some thing went wrong'
    })
  }),
  promoteUserToAdmin:expressAsyncHandler(async(req, res) => {
    const { uid } = req.params
    const response = await userService.promoteUserToAdmin(uid)
    return res.status(200).json({
      success: response ? true : false,
      updateUser: response ? response : 'Some thing went wrong'
    })
  })


}

module.exports = userController