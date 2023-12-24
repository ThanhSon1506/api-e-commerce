import expressAsyncHandler from 'express-async-handler'
import httpStatus from 'http-status'
import ApiError from '~/utils/ApiError'
import Customer from '~/models/Customer'

const customerService = {
  createCustomer: expressAsyncHandler(async (customerBody) => {
    if (await Customer.isEmailTaken(customerBody.email)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken')
    }
    return Customer.create(customerBody)
  }),

  getCustomerByEmail: expressAsyncHandler(async (email) => {
    return Customer.findOne({ email })
  }),

  getCustomerById: expressAsyncHandler(async (id) => {
    return Customer.findById(id)
  }),

  updateCustomerById: expressAsyncHandler(async (customerId, updateBody) => {
    const customer = await customerService.getCustomerById(customerId)
    if (!customer) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Customer not found')
    }
    if (updateBody.email && (await Customer.isEmailTaken(updateBody.email, customerId))) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken')
    }
    Object.assign(customer, updateBody)
    await customer.save()
    return customer
  }),

  getAllCustomers: expressAsyncHandler(async () => {
    return Customer.find()
  }),

  deleteCustomerById: expressAsyncHandler(async (customerId) => {
    return Customer.findByIdAndDelete(customerId)
  }),

  updateCustomerByAdmin: expressAsyncHandler(async (req, res) => {
    const { uid } = req.user
    if (Object.keys(req.body).length === 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Missing input')
    }
    const response = await Customer.findOneAndUpdate({ _id: uid }, req.body, { new: true }).select('-password -role -refreshToken')
    return res.status(httpStatus.OK).json({
      success: response ? true : false,
      updateCustomer: response ? response : 'Something went wrong'
    })
  }),

  queryCustomers: async (filter, options) => {
    const customers = await Customer.paginate(filter, options)
    return customers
  }

}

export default customerService