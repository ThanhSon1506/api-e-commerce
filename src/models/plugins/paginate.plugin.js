

const paginate = (schema) => {
  /**
     * @typedef {Object} QueryResult
     * @property {Document[]} results - Results found
     * @property {number} page - Current page
     * @property {number} limit - Maximum number of results per page
     * @property {number} totalPages - Total number of pages
     * @property {number} totalResults - Total number of documents
     */
  /**
     * Query for documents with pagination
     * @param {Object} [filter] - Mongo filter
     * @param {Object} [options] - Query options
     * @param {string} [options.sortBy] - Sorting criteria using the format: sortField:(desc|asc). Multiple sorting criteria should be separated by commas (,)
     * @param {string} [options.populate] - Populate data fields. Hierarchy of fields should be separated by (.). Multiple populating criteria should be separated by commas (,)
     * @param {number} [options.limit] - Maximum number of results per page (default = 10)
     * @param {number} [options.page] - Current page (default = 1)
     * @returns {Promise<QueryResult>}
     */
  schema.statics.paginate = async function (filter, options) {
    let sort = ''
    // Định dạng các truy vấn bộ lọc
    let queryString = JSON.stringify(filter)
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, matchElement => `$${matchElement}`)
    const formattedFilter = JSON.parse(queryString)

    // Kiểm tra và thêm điều kiện tìm kiếm theo tiêu đề
    if (filter?.title) {
      formattedFilter.title = {
        $regex: filter.title,
        $options: 'i'
      }
    }
    if (options.sortBy) {
      const sortingCriteria = []
      options.sortBy.split(',').forEach((sortOption) => {
        const [key, order] = sortOption.split(':')
        sortingCriteria.push((order === 'desc' ? '-' : '') + key)
      })
      sort = sortingCriteria.join(' ')
    } else {
      sort = 'createdAt'
    }


    const limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : 10
    const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1
    const skip = (page - 1) * limit

    const countPromise = this.countDocuments(formattedFilter).exec()
    let docsPromise = this.find(formattedFilter).sort(sort).skip(skip).limit(limit)

    // if (options.populate) {
    //   options.populate.split(',').forEach((populateOption) => {
    //     docsPromise = docsPromise.populate(
    //       populateOption
    //         .split('.')
    //         .reverse()
    //         .reduce((a, b) => ({ path: b, populate: a}))
    //     )
    //   })
    // }
    if (options.populate) {
      options.populate.split(',').forEach((populateOption) => {
        const pathArray = populateOption.split('.').reverse()
        const selectArray = options.select ? options.select.split(',') : []
        const populateItems = []
        pathArray.forEach((b) => {
          const populateItem = { path: b }
          populateItem.select = selectArray.join(' ')
          populateItems.push(populateItem)
        })
        const populateObj = populateItems.reduce((a, b) => ({
          path: b.path,
          populate: {
            ...b.populate,
            path: a.path,
            select: b.populate.select || a.populate.select
          }
        }))
        docsPromise = docsPromise.populate(populateObj)
      })
    }
    // Áp dụng Fields limiting
    if (options.fields) {
      const fields = options.fields.split(',').join(' ')
      docsPromise = docsPromise.select(fields)
    }

    docsPromise = docsPromise.exec()

    return Promise.all([countPromise, docsPromise]).then((values) => {
      const [totalResults, results] = values
      const totalPages = Math.ceil(totalResults / limit)
      const result = {
        results,
        page,
        limit,
        totalPages,
        totalResults
      }
      return Promise.resolve(result)
    })
  }
}

module.exports = paginate
