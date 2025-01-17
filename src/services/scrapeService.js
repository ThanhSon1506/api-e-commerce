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
  scrapeCategory: expressAsyncHandler(async (browser, url, indexScrape = null) => {
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
          _id:Math.floor(Math.random()*16777215).toString(16).padStart(6, '0') + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'),
          title: categoryElement.querySelector('a span').innerText,
          slug: slugify(categoryElement.querySelector('a span').innerText, { locale:'vi' }),
          link: categoryElement.querySelector('a').href,
          url: categoryElement.querySelector('a').href.replace('https://www.thegioididong.com', ''),
          image: categoryElement.querySelector('img')?.src,
          subcategories: []
        }
        let subcategoryElements = categoryElement.querySelectorAll('.item-child a')
        category.subcategories = Array.from(subcategoryElements).map(subcategoryElement => {
          return {
            _id:Math.floor(Math.random()*16777215).toString(16).padStart(6, '0') + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'),
            title: subcategoryElement.innerText,
            slug: slugify(subcategoryElement.innerText, { locale:'vi' }),
            link: subcategoryElement.href,
            url: subcategoryElement.href.replace('https://www.thegioididong.com', '')
          }
        })

        return category
      })
    })
    if (indexScrape) {
      dataCategories = dataCategories.filter((category, indexCategory) => indexScrape.some(index => index===indexCategory))
    }
    const modelExportPath = path.join(exportsPath, modelName )
    if (!fs.existsSync(modelExportPath)) {
      fs.mkdirSync(modelExportPath)
    }

    const outputPath = path.join(modelExportPath, `${modelName}_data.json`)
    fs.writeFileSync(outputPath, JSON.stringify(dataCategories, null, 2) )

    logger.info('Data has been saved to', modelExportPath)
    await page.close()
    logger.info('Đã đóng.')

    return dataCategories
  }),
  scrapeCategoryContent: expressAsyncHandler(async (browser, url, categoriesId) => {
    const scrapeData={
      header:[],
      category:[]
    }
    const detailLinks = []
    let currentPage = 1
    const maxPages = 5
    const infoLink=path.basename(url)
    let page = await browser.newPage()
    logger.info('Mở tab mới....')
    await page.goto(url)
    logger.info('Truy cập vào ' + url)
    let filteredData=[]
    try {
      await page.waitForSelector('.slider-bannertop .item')
      logger.info('Website đã load xong...')

      let dataContents = await page.$$eval('.slider-bannertop .item img', elements => {
        return elements.map(img => {
          const dataSrc = img.getAttribute('data-src')
          const src = img.getAttribute('src')
          const imageUrl = dataSrc ? `https:${dataSrc}` : (src ? `https:${src}` : null)
          return { banner:imageUrl }
        })

      })
      filteredData = dataContents.filter(item => item.banner !== '')
    } catch (error) {
      logger.error(`Lỗi xử lý selector: ${error.message}`)
    }

    // const jsonData = JSON.stringify(filteredData, null, 2)
    const quickLinkElementsPhone = await page.$('.lst-quickfilter.q-manu')
    let brandsFromQuickLinkPhone = []
    if (quickLinkElementsPhone) {
      await page.waitForSelector('.lst-quickfilter.q-manu')
      brandsFromQuickLinkPhone = await page.$$eval('.lst-quickfilter.q-manu a', categoryElements => {
        return categoryElements.map(element => {
          let objectData = {
            link: element.href || '',
            code: element.href.replace('https://www.thegioididong.com/', '').split('-')[0].toUpperCase() || '',
            slug: element.href.replace('https://www.thegioididong.com/', '') || '',
            title: element.href.replace('https://www.thegioididong.com/', '') || '',
            image: element.querySelector('img').src || ''
          }
          return objectData
        })
      })
    }


    const quickLinkElements = await page.$('.quick-link a')
    let brandsFromQuickLink = []
    if (quickLinkElements) {
      brandsFromQuickLink = await page.$$eval('.quick-link a', categoryElements => {
        return categoryElements.map(element => {
          let link = element.href || ''
          let slug = link.replace('https://www.thegioididong.com/', '') || ''
          let title = link.replace('https://www.thegioididong.com/', '') || ''
          let image = element.querySelector('img') ? element.querySelector('img').src || '' : ''

          let objectData = {
            link,
            slug,
            title,
            image
          }

          return objectData
        })
      })
    }

    let dataBrands = brandsFromQuickLinkPhone.concat(brandsFromQuickLink)
    dataBrands = dataBrands.map(obj => ({ ...obj, code: url.replace('https://www.thegioididong.com/', '').toUpperCase() }))
    const modelNameBrand = 'Brand'
    const modelExportPathBrand = path.join(exportsPath, modelNameBrand )
    if (!fs.existsSync(modelExportPathBrand)) {
      fs.mkdirSync(modelExportPathBrand)
    }

    const outputPathBrand = path.join(modelExportPathBrand, `${modelNameBrand}_data.json`)
    fs.writeFileSync(outputPathBrand, JSON.stringify(dataBrands, null, 2) )


    while (currentPage <= maxPages) {
      const pageUrl = `https://www.thegioididong.com/${infoLink}#c=42&o=17&pi=${currentPage}`
      // const pageUrl = `https://www.thegioididong.com/${infoLink}#c=42&o=17&pi=1`
      await page.goto(pageUrl, { waitUntil: 'domcontentloaded' })
      const pageLinks = await page.$$eval('.listproduct .item a', detailElements => {
        return detailElements.map(element => {
          return element.href
        })
      })

      if (pageLinks.length === 0) {
        logger.info('Không có thêm nội dung để tải.')
        break
      }
      const filteredLinks = pageLinks.filter(link => {
        // Loại bỏ các giá trị bắt đầu bằng "javascript:" và chứa "#"
        return !link.startsWith('javascript:') && !link.includes('#')
      })
      filteredLinks.forEach(link => {
        if (!detailLinks.includes(link)) {
          detailLinks.push(link)
        }
      })
      currentPage++
      await page.waitForTimeout(3000)
    }
    // const validLinks = detailLinks.filter(link => new RegExp(`^https://www\\.thegioididong\\.com/${infoLink}/`).test(link))

    const scrapeDetail = async(link) => {
      let pageDetail = await browser.newPage()
      await pageDetail.goto(link)
      logger.info('Đang try cập '+ link)
      await pageDetail.waitForSelector('body')

      let detailData = await pageDetail.$$eval('.detail', elements => {
        return elements.map(element => {
          let objectDetail = {
            _id:Math.floor(Math.random()*16777215).toString(16).padStart(6, '0') + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'),
            title: element.querySelector('h1')?.innerText || '',
            slug: element.querySelector('.box02__right')?.getAttribute('data-href').split('/').pop() || '',
            brand:{
              code:element.querySelector('.breadcrumb li:nth-child(1) a')?.getAttribute('href').split('/').pop().toUpperCase() || '',
              slug: element.querySelector('.breadcrumb li:nth-child(2) a')?.getAttribute('href').split('/').pop() || '',
              title: element.querySelector('.breadcrumb li:nth-child(2) a')?.getAttribute('href').split('/').pop() || '',
              name: element.querySelector('.breadcrumb li:nth-child(2) a').innerText || ''
            },
            totalRating: parseInt(element.querySelector('.detail-rate-total')?.innerText, 10) || 0,
            storage: [],
            color: [],
            quantity:parseInt(element.querySelector('.detail-rate-total')?.innerText, 10) || 0,
            price:parseInt(element.querySelector('.box-price-old')?.innerText.replace(/\D/g, ''), 10)||0,
            discount:parseInt(element.querySelector('.box-price-percent')?.innerText.replace(/\D/g, ''), 10)||0
          }
          const storageElements = element.querySelectorAll('.box03.group.desk a:not(.box03.color.group.desk a)')
          objectDetail.storage = Array.from(storageElements).map(storageElement => {
            return {
              title: storageElement?.innerText || ''
            }
          })
          const colorElements = element.querySelectorAll('.box03.color.group.desk a')
          objectDetail.color = Array.from(colorElements).map(colorElement => {
            return {
              title: colorElement?.innerText || ''
            }
          })

          return objectDetail
        })
      })
      detailData = detailData.map(obj => ({ ...obj, category: categoriesId }))
      const bannerLinks = await pageDetail.$$eval('.owl-item .owl-lazy', elements => {
        return elements.map(img => {
          const dataSrc = img.getAttribute('data-src')
          const src = img.getAttribute('src')
          const imageUrl = dataSrc ? dataSrc : (src ? src : null)
          return imageUrl
        })
      })
      detailData = detailData.map(obj => ({ ...obj, banners: bannerLinks }))
      try {
        await pageDetail.waitForSelector('.box01__tab .item .item-border img')
        const imageLinks = await pageDetail.$$eval('.box01__tab .item  .item-border img', images => {
          return images.map(img => {
            const dataSrc = img.getAttribute('data-src')
            const src = img.getAttribute('src')
            const imageUrl = dataSrc || src || null
            return imageUrl
          })
        })
        detailData = detailData.map(obj => ({ ...obj, images: imageLinks }))
      } catch (error) {
        logger.error('Không tìm thấy selector .box01__tab .item .item-border img')

      }


      const attributes = await pageDetail.$$eval('.parameter__list li', elements => {
        return elements.map(item => {
          const name = item.querySelector('.lileft')?.textContent.trim()
          const content = item.querySelector('.liright')?.textContent.trim()
          return { name, content }
        })
      })
      detailData = detailData.map(obj => ({ ...obj, attributes: attributes }))
      await pageDetail.close()
      logger.info('Đóng '+ link)
      return detailData
    }

    const scrapeDetailProduct = async(link, productId) => {
      let pageDetail = await browser.newPage()
      await pageDetail.goto(link+'#top-article')
      logger.info('Đang try cập '+ link+'#top-article')
      let detailData

      try {
        await pageDetail.waitForSelector('.content-article', { timeout: 30000 })
        detailData = await pageDetail.$$eval('.content-article', elements => {
          return elements.map(element => {
            const clone = element.cloneNode(true)
            const firstH3 = clone.querySelector('h3:first-child')
            if (firstH3) {
              firstH3.remove()
            }
            let objectDetail = {
              title: element.querySelector('h3:first-child')?.innerHTML,
              content: element.innerHTML
            }
            return objectDetail
          })
        })
      } catch (error) {
        logger.error('Không tìm thấy selector .content-article')
        detailData = []
      }

      detailData = detailData.map(obj => ({ ...obj, product: productId }))
      await pageDetail.close()
      logger.info('Đóng ' + link + '#top-article')
      return detailData
    }


    const objectDataDetail = []
    const objectProductDetail = []
    for (let link of detailLinks) {
      const scrapedData = await scrapeDetail(link)
      const objectProduct=JSON.stringify(...scrapedData, null, 2)
      const scrapedDataProductDetail = await scrapeDetailProduct(link, JSON.parse(objectProduct)?._id)
      objectProductDetail.push(...scrapedDataProductDetail)
      objectDataDetail.push(...scrapedData)
    }
    const modelName = 'Product'
    const modelExportPath = path.join(exportsPath, modelName)
    if (!fs.existsSync(modelExportPath)) {
      fs.mkdirSync(modelExportPath)
    }
    const outputPath = path.join(modelExportPath, `${modelName}_data.json`)
    let existingData = []
    if (fs.existsSync(outputPath)) {
      const existingDataString = fs.readFileSync(outputPath, 'utf8')
      existingData = JSON.parse(existingDataString)
    }
    existingData.push(...objectDataDetail)
    fs.writeFileSync(outputPath, JSON.stringify(existingData, null, 2))

    const modelDetailProduct='DetailProduct'
    const modelExportPathDetail = path.join(exportsPath, modelDetailProduct )
    if (!fs.existsSync(modelExportPathDetail)) {
      fs.mkdirSync(modelExportPathDetail)
    }
    const outputPathDetail = path.join(modelExportPathDetail, `${modelDetailProduct}_data.json`)
    let existingDataDetail = []
    if (fs.existsSync(outputPath)) {
      const existingDataString = fs.readFileSync(outputPath, 'utf8')
      existingDataDetail = JSON.parse(existingDataString)
    }
    existingData.push(...objectProductDetail)

    fs.writeFileSync(outputPathDetail, JSON.stringify(existingDataDetail, null, 2) )

    scrapeData.header=filteredData
    logger.info('Ghi dữ liệu vào tệp JSON hoàn tất')
    logger.info(JSON.stringify(objectProductDetail, null, 2))

    // await page.close()
    // logger.info('Đã đóng.')
    // process.exit(0)
  }),

  scrapeAddress: expressAsyncHandler(async (browser, url) => {
    const modelName = 'Address'
    let page = await browser.newPage()
    try {
      logger.info('Mở tab mới....')
      await page.goto(url)
      logger.info('Truy cập vào ' + url)

      await page.waitForSelector('.header .header__top .header__address', { visible: true })
      await page.click('.header .header__top .header__address')
      await page.waitForSelector('.locationbox-v2', { visible: true })
      logger.info('Website đã load xong...')

      const provinces = await page.$$eval('#lst-prov .listing-locale ul li a', options => {
        return options.map(option => {
          return {
            name: option.innerText.trim(),
            value: option.getAttribute('data-value'),
            districts: []
          }
        })
      })

      for (const province of provinces) {
        logger.info(`Nhấp vào tỉnh/ thành phố: ${province.name}`)
        await Promise.all([
          page.click(`#lst-prov .listing-locale a[data-value="${province.value}"]`),
          page.waitForSelector('#lst-dis', { visible: true })
        ])
        const districtNames = await page.$$eval('#lst-dis .listing-locale ul li a', options => {
          return options.map(option => {
            return {
              name: option.innerText.trim(),
              value: option.getAttribute('data-dis')
            }
          })
        })

        province.districts = districtNames.map(districtName => ({ ...districtName, wards: [] }))
        logger.info(JSON.stringify(province.districts, null, 2))
        for (const district of province.districts) {
          try {
            logger.info(`Nhấp vào quận/huyện: ${district.name}`)
            page.click(`#lst-dis .listing-locale a[data-dis="${district.value}"]`)
            const wardSelector = await page.$('#lst-ward')
            if (wardSelector) {
              await Promise.all([
                page.waitForSelector('#lst-ward', { visible: true, timeout: 10000 })
              ])
            } else {
              await page.click('.location-title .back-ic')
            }
          } catch (error) {
            logger.error(`Lỗi khi xử lý quận/huyện ${district.name}`)
            logger.error(error)
          }
          const wardNames = await page.$$eval('#lst-ward .listing-locale ul li a', options => {
            return options.map(option => {
              return {
                name:option.innerText.trim(),
                value: option.getAttribute('data-value')
              }
            } )
          })
          await page.click('.location-title .back-ic')
          district.wards = wardNames.map(wardName => ({ ...wardName }))
          logger.info(JSON.stringify( district.wards, null, 2))
        }
        await page.click('.location-title .back-ic')
      }
      logger.info(JSON.stringify(provinces, null, 2))
      const modelExportPath = path.join(exportsPath, modelName )
      if (!fs.existsSync(modelExportPath)) {
        fs.mkdirSync(modelExportPath)
      }
      const outputPath = path.join(modelExportPath, `${modelName}_data.json`)
      fs.writeFileSync(outputPath, JSON.stringify(provinces, null, 2) )
      logger.info('Dữ liệu address đã được xuất')
    } catch (error) {
      logger.error('Lỗi:', error)
    } finally {
      // await page.close()
      // process.exit(0)
    }
  })
}

module.exports = scrapeService