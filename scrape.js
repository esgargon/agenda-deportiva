import puppeteer from 'puppeteer';
import fs from 'fs';

const URL = 'https://pelotalibretv.com/agenda.html';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'], headless: true });
  const page = await browser.newPage();

  await page.goto(URL, { waitUntil: 'domcontentloaded' });

  await page.waitForSelector('.table-responsive');

  const eventos = await page.evaluate(() => {
    const filas = Array.from(document.querySelectorAll('.table-responsive tbody tr'));
    return filas.map(fila => {
      const columnas = fila.querySelectorAll('td');
      return {
        hora: columnas[0]?.innerText.trim(),
        evento: columnas[1]?.innerText.trim(),
        canal: columnas[2]?.innerText.trim(),
        enlace: fila.querySelector('a')?.href || null
      };
    });
  });

  await browser.close();

  fs.writeFileSync('agenda.json', JSON.stringify(eventos, null, 2));
})();
