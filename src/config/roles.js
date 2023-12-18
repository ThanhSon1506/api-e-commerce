// ở đây mình set cứng quyền

const roles = ['user', 'admin']

const roleRights = new Map()
roleRights.set(roles[0], [])
roleRights.set(roles[1], ['manageAdmin', 'manageUser', 'manageProduct', 'manageBlog', 'manageBrand', 'manageCoupon', 'manageShop'])

module.exports = {
  roles,
  roleRights
}