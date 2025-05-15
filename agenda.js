fetch('agenda.json')
  .then(response => response.json())
  .then(data => {
    const agendaContainer = document.getElementById('agenda');
    agendaContainer.innerHTML = ''; // Limpiar texto "Cargando agenda..."
    data.forEach(evento => {
      const item = document.createElement('div');
      item.className = 'evento';
      item.innerHTML = `<strong>${evento.hora}</strong> - ${evento.evento} <br><a href="${evento.link}" target="_blank">Ver en vivo</a>`;
      agendaContainer.appendChild(item);
    });
  })
  .catch(error => {
    document.getElementById('agenda').innerHTML = 'Error cargando la agenda';
    console.error('Error al cargar agenda:', error);
  });
