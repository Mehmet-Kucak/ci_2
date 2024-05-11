const puppeteer = require('puppeteer');
const chromium = require('chrome-aws-lambda');

const getProducts = async (req, res) => {
  try {
    const browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();

    // Block unnecessary resources
    await page.setRequestInterception(true);
    page.on('request', (req) => {
        if (req.resourceType() === 'stylesheet' || req.resourceType() === 'font' || req.resourceType() === 'image') {
            req.abort();
        } else {
            req.continue();
        }
    });

    await page.goto('https://ci.turkpatent.gov.tr/veri-tabani', { waitUntil: 'networkidle0' });

    await page.waitForSelector('#CityId');
    await page.select('#CityId', '09');

    await page.waitForSelector('#StatusId');
    await page.select('#StatusId', '545');

    await page.waitForSelector('select[name="tablo_length"]');
    await page.select('select[name="tablo_length"]', '150');
    await page.waitForSelector('.loadingoverlay');
    await page.waitForSelector('.loadingoverlay', { hidden: true });

    const data = await page.evaluate(() => {
        const table = document.querySelector('#tablo');
        const rows = Array.from(table.querySelectorAll('tr'));
        return rows.map(row => {
            const columns = row.querySelectorAll('td');
            return Array.from(columns, column => column.innerText);
        });
    });

    await browser.close();

    res.status(200).json({ data });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while scraping the website.' });
  }
};

export default getProducts;