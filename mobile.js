const app = require('express')()
const puppeteer = require('puppeteer');
const router = require('express').Router()

router.use(require('express').urlencoded({extended: false}))

router.route('/')
  .post((req, res) => {
    findOnMobile(req.body.mark, req.body.ort, req.body.distance, () => res.sendFile(`${__dirname}/screenshots/example1.png`))    
  })

async function findOnMobile(mark, ort, distance, callback){

  const browser = await puppeteer.launch({headless: false, slowMo:10});
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080});

  await page.goto('https://www.mobile.de/');

  //await page.waitForSelector("#mde-consent-modal-legal-text") соглашается с куки (allowed cookies)
  await page.waitForSelector('#mde-consent-modal-container > div.sc-iBkjds.frmJSB > div.sc-papXJ.ixHhna > div.sc-jqUVSM.dBIrCF > button')
  await page.click('#mde-consent-modal-container > div.sc-iBkjds.frmJSB > div.sc-papXJ.ixHhna > div.sc-jqUVSM.dBIrCF > button')


  //open more filter, sometimes must change selector
  await page.waitForSelector('[data-testid="qs-more-filter"]')
  await page.click('[data-testid="qs-more-filter"]');

  await page.waitForSelector('#selectMake1-ds')
  await page.waitForTimeout(2000)
  //await page.select('#selectMake1-ds', '140')

  const sectionChoiseMarkAuto = await page.$('#selectMake1-ds')
  await sectionChoiseMarkAuto.click()
  await sectionChoiseMarkAuto.type(mark)

  // await page.evaluate((mark) => {
  //   const elements = [...document.querySelectorAll('option')];
  //   const element = elements.find(el => el.innerText === mark);
  //   //console.log(element.$eval(this, el => el.value))
  //   //element.click();
  // });

  // const markAuto = await sectionChoiseMarkAuto.$$('option')
  // console.log(await markAuto[2].$eval('xpath//', el => el.innerHTML))
  // var m = '0'

  // for (var i = 0; i < markAuto.length; i++) {
  //   if (await markAuto[i].$eval('option', el => el.innerText)==mark) {
  //     m = markAuto[i]
  //     console.log(await m.$eval('option', el => el.innerText))
  //     await m.$eval('option', el => el.selected = 'true')
  //     break;
  //   }   
  // }

  await page.waitForSelector('#ambit-search-location')
  await page.type('#ambit-search-location', ort)

  await page.waitForTimeout(1500)
  await page.keyboard.press('Enter')

  await page.$eval('#ambit-search-radius', el => el.value = '')
  await page.type('#ambit-search-radius', distance)
  await page.waitForTimeout(1000)
  await page.click('#daysAfterCreation-1-ds')
  await page.waitForTimeout(800)
  await page.keyboard.press('Enter')
  

  //await page.click('#root > div > div > article.RSseD._3LZ_7._2iEKW > section > div > div.UiAUP > div > div._1bip7 > button')
  //body > div.viewport > div:nth-child(1) > div:nth-child(3) > div:nth-child(4) > div.g-col-9 > div.cBox.cBox--content.cBox--resultList

  await page.waitForTimeout(3000)
  //const button = await page.$('#dsp-upper-search-btn')
  //await button.click()

  const listAuto = await page.$('div.g-col-9')
  const punktOfListAuto = await listAuto.$$('div.cBox-body--resultitem')

  let foundAuto = []
  let m = 0

  for (var i = 0; i < punktOfListAuto.length; i++) {
    if (await punktOfListAuto[i].$('span.new-headline-label')) {
      foundAuto.push({
        photolink: await punktOfListAuto[i].$eval('img', el => el.src),
        description: await punktOfListAuto[i].$eval('div.g-row', el => el.innerText),
        link: await punktOfListAuto[i].$eval('a', el => el.href)
      }) 
      m++
    }
  }
  console.log(m)

  await page.screenshot({path: `${__dirname}/screenshots/example1.png`})
  await browser.close();
  callback(foundAuto);
}

//let a = findOnMobile('Audi', 'cottbus', '5', () => console.log('ok'))

module.exports = findOnMobile;