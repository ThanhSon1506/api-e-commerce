import expressAsyncHandler from 'express-async-handler'
import { addressService, cartService, customerService } from '~/services'
import httpStatus from 'http-status'
import pick from '~/utils/pick'

const customerController = {
  createCustomer: expressAsyncHandler(async (req, res) => {
    const customer = await customerService.createCustomer(req.body)
    res.status(httpStatus.CREATED).send(customer)
  }),

  getAllCustomers: expressAsyncHandler(async (req, res) => {
    const filter = pick(req.query, ['title', 'role'])
    const options = pick(req.query, ['sortBy', 'limit', 'page', 'fields', 'populate'])
    if (!('fields' in options)) {
      options.fields = '-password -role'
    }
    const result = await customerService.queryCustomers(filter, options)
    return res.status(httpStatus.OK).json({
      success: result ? true : false,
      customers: result
    })
  }),

  getCurrentCustomer: expressAsyncHandler(async (req, res) => {
    const { sub } = req.user
    const customerCurrent = await customerService.getCustomerById(sub)
    return res.status(httpStatus.OK).json({
      success: customerCurrent ? true : false,
      message: customerCurrent ? customerCurrent : 'Customer not found'
    })
  }),

  deleteCustomer: expressAsyncHandler(async (req, res) => {
    const { uid } = req.params
    const response = await customerService.deleteCustomerById(uid)
    return res.status(httpStatus.OK).json({
      success: response ? true : false,
      deleteCustomer: response ? `Customer with email ${response.email} deleted` : 'No customer deleted'
    })
  }),

  updateCustomer: expressAsyncHandler(async (req, res) => {
    const { sub: uid } = req.user
    const response = await customerService.updateCustomerById(uid, req.body)
    return res.status(httpStatus.OK).json({
      success: response ? true : false,
      updateCustomer: response ? response : 'Something went wrong'
    })
  }),

  updateCustomerAddress: expressAsyncHandler(async (req, res) => {
    const { sub: customerId } = req.user
    const response = await addressService.updateUserAddress(customerId, req.body)
    return res.status(httpStatus.OK).json({
      success: response ? true : false,
      updateCustomer: response ? response : 'Something went wrong'
    })
  }),

  updateCustomerCart: expressAsyncHandler(async (req, res) => {
    const { sub: customerId } = req.user
    const response = await cartService.createCart(customerId, req.body)
    return res.status(httpStatus.OK).json({
      success: response ? true : false,
      updateCustomer: response ? response : 'Something went wrong'
    })
  })
}

/**
 * 1 khách hàng có địa chỉ, và 1 dịa chỉ phụ
 * */
export default customerController
