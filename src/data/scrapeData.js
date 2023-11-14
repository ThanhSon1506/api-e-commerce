const startBrowser = require('~/config/startBrowser')
const { scrapeData } = require('~/controllers/scrapeController')

let browser = startBrowser()

scrapeData(browser)