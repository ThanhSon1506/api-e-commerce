const convert = {
  convertStringRoute:(str) => {
    var result = str.replace('Route', '')
    result = result.replace(/([A-Z])/g, '-$1')
    result = result.toLowerCase()
    if (result.startsWith('-')) {
      result = result.slice(1)
    }
    return result
  }
}

module.exports = convert