const expressAsyncHandler = require('express-async-handler')
const scrapeService = require('~/services/scrapeService')

const scrapeController = {
  scrapeData:expressAsyncHandler(async(browserInstance) => {
    let url = 'https://www.thegioididong.com/'
    const indexes = [1, 2, 3, 4]
    let browser = await browserInstance
    let dataCategories = await scrapeService.scrapeCategory(browser, url)
    const selectedCategories = dataCategories.filter((category, indexCategory) => indexes.some(index => index===indexCategory))

    return selectedCategories
  })
}
module.exports=scrapeController