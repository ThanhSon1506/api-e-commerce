const expressAsyncHandler = require('express-async-handler')
const scrapeService = require('~/services/scrapeService')

const scrapeController = {
  scrapeData:expressAsyncHandler(async(browserInstance) => {
    let url = 'https://www.thegioididong.com/'
    const indexes = [0, 1, 2, 3]
    let browser = await browserInstance
    let dataCategories = await scrapeService.scrapeCategory(browser, url, indexes)
    await scrapeService.scrapeCategoryContent(browser, dataCategories[0].link)
  })
}
module.exports=scrapeController