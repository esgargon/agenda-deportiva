import puppeteer from 'puppeteer';
import { writeFile } from 'fs/promises';

const URL = 'https://pelotalibretv.com/agenda.html';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto(URL, { waitUntil: 'networkidle2' });

  const events = await page.evaluate(() => {
    const data = [];
    const items = document.querySelectorAll('.event-list .event');
    items.forEach(item => {
      const time = item.querySelector('.event-time')?.innerText || '';
      const teams = item.querySelector('.event-title')?.innerText || '';
      const link = item.querySelector('a')?.href || '';
      data.push({ time, teams, link });
    });
    return data;
  });

  await writeFile('agenda.json', JSON.stringify(events, null, 2));
  await browser.close();
})();
