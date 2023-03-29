const app = require('express')()
const puppeteer = require('puppeteer');
const { scrollPageToBottom } = require('puppeteer-autoscroll-down');

async function findSelectorOnEbay() {
	const browser = await puppeteer.launch({headless: false, slowMo:10});
  	const page = await browser.newPage();
  	await page.setViewport({ width: 1920, height: 1080});
  	await page.goto('https://www.ebay-kleinanzeigen.de/');

  	// await page.waitForSelector('#mde-consent-modal-container > div.sc-iBkjds.frmJSB > div.sc-papXJ.ixHhna > div.sc-jqUVSM.dBIrCF > button')
   //  await page.click('#mde-consent-modal-container > div.sc-iBkjds.frmJSB > div.sc-papXJ.ixHhna > div.sc-jqUVSM.dBIrCF > button')

	await page.waitForSelector('#gdpr-banner-backdrop');
  	await page.click('#gdpr-banner-accept');

  	const lastPosition = await scrollPageToBottom(page, {
  size: 500,
  delay: 250
})
	await page.waitForTimeout(120000);

	//#srchrslt-adtable > li:nth-child(1) > article > div.aditem-image > a > div > img gdpr-banner-backdrop
	//#srchrslt-adtable > li:nth-child(8) > article > div.aditem-image > a > div > img gdpr-banner-accept


  	var selector = '[#srchrslt-adtable > li:nth-child(1) > article > div.aditem-image > a > div > img]';//сюда вписать селектор, который надо найти
  	await page.waitForSelector(selector);
  	console.log(await page.$$eval(selector, el => el.src))

  	await page.screenshot({path: `${__dirname}/screenshots/tool.png`})
  	await browser.close();
} findSelectorOnEbay();