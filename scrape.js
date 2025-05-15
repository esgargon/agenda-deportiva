const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function scrapeAgenda() {
  try {
    const url = 'https://pelotalibretv.com/agenda.html';
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const events = [];

    // Aquí debes cambiar estos selectores según la página real
    $('.event-class').each((i, el) => {
      const hora = $(el).find('.hora-class').text().trim();
      const nombre = $(el).find('.nombre-class').text().trim();
      const link = $(el).find('a').attr('href');
      if (hora && nombre && link) {
        events.push({ hora, nombre, link });
      }
    });

    fs.writeFileSync('agenda.json', JSON.stringify(events, null, 2));
    console.log('Agenda actualizada con éxito.');
  } catch (error) {
    console.error('Error al scrapear la agenda:', error.message);
  }
}

scrapeAgenda();
