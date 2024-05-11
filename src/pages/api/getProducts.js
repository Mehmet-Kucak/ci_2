const puppeteer = require('puppeteer');

const getProducts = async (req, res) => {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    const inputValue = req.query.input;

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
    await page.select('#CityId', inputValue);

    await page.waitForSelector('#StatusId');
    await page.select('#StatusId', '545');

    await page.waitForSelector('select[name="tablo_length"]');
    await page.select('select[name="tablo_length"]', '150');
    await page.waitForSelector('.loadingoverlay');
    await page.waitForSelector('.loadingoverlay', { hidden: true });

    const data = await page.evaluate(() => {
      const table = document.querySelector('#tablo');
      const rows = Array.from(table.querySelectorAll('tr'));
      return rows.flatMap(row => {
        const columns = row.querySelectorAll('td');
        return Array.from(columns, column => {
          const link = column.querySelector('a');
          return link ? [link.innerText ,link.href] : null;
        }).filter(Boolean); // filter out null values
      });
    });

    const scrapedData = [];
    for (const href of data) {
      try {
        await page.goto(href);
        const imageSrcs = await page.evaluate(() => {
          const images = Array.from(document.querySelectorAll('img'));
          return images.map(img => img.src);
        });
        scrapedData.push(imageSrcs);
      } catch (error) {
        console.error(`Error scraping ${href}:`, error);
      }
    }

    await browser.close();

    res.status(200).json({ data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while scraping the website.' });
  }
};

export default getProducts;