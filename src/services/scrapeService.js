const expressAsyncHandler = require('express-async-handler')
const logger = require('~/config/logger')
const fs = require('fs')
const path = require('path')
const { default: slugify } = require('slugify')
const exportsPath = path.join(__dirname, '..', 'exports')
if (!fs.existsSync(exportsPath)) {
  fs.mkdirSync(exportsPath)
}

const scrapeService = {
  scrapeCategory: expressAsyncHandler(async (browser, url) => {
    const modelName= 'ProductCategory'
    let page = await browser.newPage()
    logger.info('Mở tab mới....')
    await page.goto(url)
    logger.info('Truy cập vào ' + url)
    await page.waitForSelector('body')
    logger.info('Website đã load xong...')

    let dataCategories = await page.$$eval('.main-menu>li', categoryElements => {
      return categoryElements.map(categoryElement => {
        let category = {
        title: categoryElement.querySelector('a span').innerText,
          slug: slugify(categoryElement.querySelector('a span').innerText, { locale:'vi' }),
          link: categoryElement.querySelector('a').href.replace('https://www.thegioididong.com', ''),
          image: categoryElement.querySelector('img')?.src,
          subcategories: []
        }
        let subcategoryElements = categoryElement.querySelectorAll('.item-child a')
        category.subcategories = Array.from(subcategoryElements).map(subcategoryElement => {
          return {
            title: subcategoryElement.innerText,
            slug: slugify(subcategoryElement.innerText, { locale:'vi' }),
            link: subcategoryElement.href.replace('https://www.thegioididong.com', '')
          }
        })

        return category
      })
    })

    const jsonData = JSON.stringify(dataCategories, null, 2)
    logger.info(jsonData)

    const modelExportPath = path.join(exportsPath, modelName )
    if (!fs.existsSync(modelExportPath)) {
      fs.mkdirSync(modelExportPath)
    }
    const outputPath = path.join(modelExportPath, `${modelName}_data.json`)
    fs.writeFileSync(outputPath, jsonData)

    logger.info('Data has been saved to:', modelExportPath)
    await page.close()
    logger.info('Đã đóng.')
    return dataCategories
  })
}

module.exports = scrapeService