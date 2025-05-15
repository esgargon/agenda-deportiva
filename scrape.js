import puppeteer from 'puppeteer';
import fs from 'fs';

const URL = 'https://pelotalibretv.com/agenda.html';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'], headless: "new" });
  const page = await browser.newPage();

  try {
    await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 });

    // Esperamos hasta que aparezca al menos una fila de la tabla
    await page.waitForSelector('.table-responsive tbody tr', { timeout: 60000 });

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

    fs.writeFileSync('agenda.json', JSON.stringify(eventos, null, 2));
    console.log('Agenda actualizada con éxito');
  } catch (error) {
    console.error('Error al extraer datos:', error);
  } finally {
    await browser.close();
  }
})();
