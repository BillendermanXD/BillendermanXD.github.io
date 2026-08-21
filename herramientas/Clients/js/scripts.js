const searchInput = document.getElementById('searchInput');
const searchResult = document.getElementById('searchResult');

async function fetchData(path) {
    try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
    } catch (error) {
    console.error('Error al cargar los clientes:', error);
    return [];
  }
}

async function searchClients() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  searchResult.innerHTML = '';

  if (!searchTerm) {
    return;
  }

  const clients = window.hakinovCatalogo?.clientes || await fetchData('../acticulos/clientes.json');
  const matches = clients.filter(item =>
    item && item.nombre && item.nombre.toLowerCase().includes(searchTerm)
  );

  if (matches.length === 0) {
    searchResult.innerHTML = '<li>No se encontraron clientes.</li>';
    return;
    }

  matches.forEach(item => {
    const listItem = document.createElement('li');
    const link = document.createElement('a');
    link.href = item.pagina ? `../${item.pagina}` : (item.url || '#');
    link.textContent = item.nombre;
    if (!item.pagina && item.tipoUrl === 'externa') {
      link.target = '_blank';
      link.rel = 'noreferrer';
    }
    listItem.appendChild(link);
    searchResult.appendChild(listItem);
  });
}

searchInput.addEventListener('input', searchClients);