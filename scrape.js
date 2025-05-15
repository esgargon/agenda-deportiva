import puppeteer from 'puppeteer';

const url = 'https://pelotalibretv.com/agenda.html';

const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});
const page = await browser.newPage();
await page.goto(url, { waitUntil: 'networkidle2' });

await page.waitForSelector('li');

const events = await page.evaluate(() => {
  const listItems = document.querySelectorAll('li');
  const data = [];

  listItems.forEach((li) => {
    const mainLink = li.querySelector(':scope > a');
    const timeSpan = mainLink?.querySelector('.t');
    const subLinks = li.querySelectorAll('ul li a');

    if (mainLink && timeSpan && subLinks.length > 0) {
      const category = li.className.trim();
      const titleText = mainLink.innerText.replace(timeSpan.innerText, '').trim();
      const time = timeSpan.innerText.trim();

      const links = Array.from(subLinks).map(a => ({
        label: a.innerText.trim(),
        url: 'https://pelotalibretv.com' + a.getAttribute('href')
      }));

      data.push({
        category,
        title: titleText,
        time,
        links
      });
    }
  });

  return data;
});

import fs from 'fs';
fs.writeFileSync('agenda.json', JSON.stringify(events, null, 2));

await browser.close();
