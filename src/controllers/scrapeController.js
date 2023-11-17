const expressAsyncHandler = require('express-async-handler')
const scrapeService = require('~/services/scrapeService')

const scrapeController = {
  scrapeData:expressAsyncHandler(async(browserInstance) => {
    let url = 'https://www.thegioididong.com/'
    const indexes = [0, 1]
    let browser = await browserInstance
    let dataCategories = await scrapeService.scrapeCategory(browser, url, indexes)
    await scrapeService.scrapeCategoryContent(browser, dataCategories[0].link, dataCategories[0]._id)
    await scrapeService.scrapeCategoryContent(browser, dataCategories[1].link, dataCategories[1]._id)
  })
}
module.exports=scrapeController