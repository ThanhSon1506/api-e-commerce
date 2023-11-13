const startBrowser = require('~/utils/startBrowser')
const { scrapeData } = require('~/controllers/scrapeController')

let browser = startBrowser()

scrapeData(browser)