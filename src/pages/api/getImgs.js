const puppeteer = require('puppeteer');

const getImgs = async (req, res) => {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    const inputValue = req.query.input;

    await page.setRequestInterception(true);
    page.on('request', (req) => {
        if (req.resourceType() === 'stylesheet' || req.resourceType() === 'font') {
            req.abort();
        } else {
            req.continue();
        }
    });
    
    await page.goto(inputValue, { waitUntil: 'networkidle0' });
    
    // Scrape images
    const data = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'));
      return images.map(img => img.src);
    });
    
    await browser.close();
    
    res.status(200).json({ data });
    } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while scraping the website.' });
    }
}
export default getImgs;