const puppeteer=require('puppeteer')
const logger = require('~/config/logger')

const startBrowser =async() => {
  let browser
  try {
    browser=await puppeteer.launch({
      // Có hiện thị ui của Chromium hay không, false là có
      headless:false,
      // Chrome sử dụng multiple layer của sandbox để tránh những nội dung web không đáng tin cậy
      args:['--disable-setuid-sandbox'],
      // Try cập website bỏ qua lỗi liên quan http secure
      'ignoreHTTPSErrors':true
    })
  } catch (error) {
    logger.log('Không tạo được browser: '+error)
  }
  return browser
}

module.exports=startBrowser