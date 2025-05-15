const cheerio = require('cheerio');
const fs = require('fs');
const https = require('https');

const url = 'https://pelotalibretv.com/agenda.html';

https.get(url, (res) => {
  let data = '';

  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const $ = cheerio.load(data);
    const eventos = [];

    $('table tbody tr').each((i, el) => {
      const hora = $(el).find('td').eq(0).text().trim();
      const evento = $(el).find('td').eq(1).text().trim();
      const link = $(el).find('a').attr('href') || '';

      if (hora && evento) {
        eventos.push({ hora, evento, link });
      }
    });

    fs.writeFileSync('agenda.json', JSON.stringify(eventos, null, 2));
    console.log('Agenda actualizada');
  });
}).on('error', err => {
  console.error('Error al obtener la agenda:', err);
});
