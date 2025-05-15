import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs';

async function scrapeAgenda() {
  const url = 'https://pelotalibretv.com/agenda.html';

  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const eventos = [];

    $('.event').each((i, el) => {
      const hora = $(el).find('.hora').text().trim();
      const partido = $(el).find('.partido').text().trim();
      const link = $(el).find('a').attr('href') || '';

      if (hora && partido && link) {
        eventos.push({ hora, partido, link });
      }
    });

    fs.writeFileSync('agenda.json', JSON.stringify(eventos, null, 2));
    console.log('Agenda actualizada correctamente.');
  } catch (error) {
    console.error('Error al obtener la agenda:', error.message);
    process.exit(1);
  }
}

scrapeAgenda();
