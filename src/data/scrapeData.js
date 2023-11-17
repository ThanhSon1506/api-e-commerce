const startBrowser = require('~/config/initScrape')
const { scrapeData } = require('~/controllers/scrapeController')

let browser = startBrowser()

scrapeData(browser)