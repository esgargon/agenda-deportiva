async function loadAgenda() {
  try {
    const res = await fetch('agenda.json');
    if (!res.ok) throw new Error('No se pudo cargar agenda.json');
    const agenda = await res.json();

    const container = document.getElementById('agenda-container');
    container.innerHTML = '';

    agenda.forEach(evento => {
      const div = document.createElement('div');
      div.className = 'evento';

      div.innerHTML = `
        <span class="hora">${evento.hora}</span> -
        <span class="nombre">${evento.evento}</span> -
        <a href="${evento.link}" target="_blank" rel="noopener">Ver en vivo</a>
      `;

      container.appendChild(div);
    });
  } catch (error) {
    document.getElementById('agenda-container').textContent = 'Error cargando la agenda.';
    console.error(error);
  }
}

loadAgenda();
