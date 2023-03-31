const app = require('express')()
const puppeteer = require('puppeteer');
const { scrollPageToBottom } = require('puppeteer-autoscroll-down');
const router = require('express').Router()

router.use(require('express').urlencoded({extended: false}))

router.route('/')
  .post((req, res) => {
    findOnEbay(req.body.mark, req.body.ort, req.body.distance, () => res.sendFile(`${__dirname}/screenshots/example.png`))    
  })


async function findOnEbay(mark, ort, distance, callback) {

  const browser = await puppeteer.launch({headless: false, args: ['--headless'], slowMo:10});
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080});

  await page.goto('https://www.ebay-kleinanzeigen.de/');
  
  //const selector = "#site-search-submit"

  //await page.waitForSelector(selector)
  //const searchValue = await page.$eval(selector, el => el.textContent)
  //accepts cookies
  await page.waitForSelector('#gdpr-banner-backdrop');
  await page.click('#gdpr-banner-accept');
  await page.waitForTimeout(2000);
  //console.log(await page.$eval('a.j-overlay-close', el => el.title))
  await page.click('a.j-overlay-close');

  await page.$eval('#site-search-query', el => el.value = 'auto')
  await page.$eval('#site-search-area', (el, ort) => (el.value = ort), ort)
  await page.$eval('#site-search-distance-value', (el, distance) => (el.value = distance), distance)

  const searchValue = await page.$eval(selector, el => el.textContent);
  await page.click(selector);
  await page.waitForTimeout(7000)//await page.waitForSelector('header.splitheader-centered')
  
  //console.log(searchValue)

  const sectionChoiseMarkAuto = await page.$('section.browsebox-attribute')
  const markAuto = await sectionChoiseMarkAuto.$$('li')
  var m = '0'

  for (var i = 0; i < markAuto.length; i++) {
    if (await markAuto[i].$eval('a', el => el.innerText)==mark) {
      m = markAuto[i]
      break;
    }   
  }

  //await page.goto(await m.$eval('a', el => el.href)) // выбор марки, может пригодиться
  await page.$eval('#site-search-query', (el, mark) => (el.value = mark), mark);
  await page.click(selector);
  await page.waitForSelector('#browsebox-searchform > div > section:nth-child(1) > div > ul > li:nth-child(1) > ul > li:nth-child(1) > a');
  await page.click('#browsebox-searchform > div > section:nth-child(1) > div > ul > li:nth-child(1) > ul > li:nth-child(1) > a');

  //console.log(await markAuto[1].$eval('a', el => el.innerText));
  await page.waitForTimeout(10000)
  await page.screenshot({path: `${__dirname}/screenshots/example.png`});

  const lastPosition = await scrollPageToBottom(page, {
    size: 500,
    delay: 250
  })

  const listAuto = await page.$('#srchrslt-adtable')
  const punktOfListAuto = await listAuto.$$('li.lazyload-item')

  // const ppp = await listAuto.$$('li.lazyload-item')
  // console.log(ppp.length)

  // if ((await ppp[0].$eval('div.aditem-main--top--right', el => el.innerText)).indexOf("Heute") >= 0) {
  //   console.log(await ppp[0].$eval('div.aditem-main--top--right', el => el.innerText))

  // }
  
  m = 0;
  let foundAuto = []

  for (var i = 0; i < punktOfListAuto.length; i++) {
    if ((await punktOfListAuto[i].$eval('div.aditem-main--top--right', el => el.innerText)).indexOf("Heute") >= 0) {
      m++;
      //var photo = await punktOfListAuto[i].$('div.imagebox');
      console.log(await punktOfListAuto[i].$eval('article.aditem', el => el.innerText))
      foundAuto.push({
        photolink: await punktOfListAuto[i].$eval('article.aditem img', el => el.src),
        description: await punktOfListAuto[i].$eval('article.aditem', el => el.innerText), 
        link: await punktOfListAuto[i].$eval('a', el => el.href)
      })
    }  
  }

  console.log(m)

  await browser.close();
  callback(foundAuto);
}

module.exports = findOnEbay;
