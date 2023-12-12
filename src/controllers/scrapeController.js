const expressAsyncHandler = require('express-async-handler')
const scrapeService = require('~/services/scrapeService')

const scrapeController = {
  scrapeData:expressAsyncHandler(async(browserInstance) => {
    let url = 'https://www.thegioididong.com/'
    const indexes = [0, 1, 2, 3, 4, 5, 6, 7, 8]
    let browser = await browserInstance
    let dataCategories = await scrapeService.scrapeCategory(browser, url, indexes)
    for (const category of dataCategories) {
      await scrapeService.scrapeCategoryContent(browser, category.link, category._id)
    }
    // await scrapeService.scrapeCategoryContent(browser, dataCategories[0].link, dataCategories[0]._id)
    // await scrapeService.scrapeCategoryContent(browser, dataCategories[2].link, dataCategories[2]._id)
    // await scrapeService.scrapeCategoryContent(browser, dataCategories[1].link, dataCategories[1]._id)
    // await scrapeService.scrapeAddress(browser, url)
  })
}
module.exports=scrapeController