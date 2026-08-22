const searchInput = document.getElementById('searchInput');
const searchResult = document.getElementById('searchResult');
const clientsGrid = document.getElementById('clientsGrid');
const clientsEmpty = document.getElementById('clientsEmpty');
const clients = window.hakinovCatalogo?.clientes || [];

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

function createClientCard(client) {
  const link = document.createElement('a');
  link.className = 'client-card';
  link.href = client.pagina ? `../${client.pagina}` : (client.url || '#');
  if (!client.pagina && client.tipoUrl === 'externa') {
    link.target = '_blank';
    link.rel = 'noreferrer';
  }

  const image = document.createElement('img');
  const imagePath = client.imagen || 'Resorce/img/atlas.jpeg';
  image.src = imagePath.startsWith('http') ? imagePath : `../${imagePath.replace(/^\.\.\//, '')}`;
  image.alt = `Portada de ${client.nombre}`;
  image.loading = 'lazy';
  image.addEventListener('error', () => { image.src = '../Resorce/img/fondo.jpeg'; });

  const content = document.createElement('span');
  const name = document.createElement('strong');
  name.textContent = client.nombre;
  const description = document.createElement('small');
  description.textContent = client.descripcion || 'Ver información del cliente.';
  content.append(name, description);
  link.append(image, content);
  return link;
}

function renderClients(searchTerm = '') {
  const normalizedTerm = searchTerm.trim().toLowerCase();
  const matches = clients.filter(client => {
    const searchableText = `${client.nombre || ''} ${client.descripcion || ''}`.toLowerCase();
    return searchableText.includes(normalizedTerm);
  });
  clientsGrid.replaceChildren(...matches.map(createClientCard));
  clientsEmpty.hidden = clients.length > 0;
}

renderClients();
searchInput.addEventListener('input', event => {
  renderClients(event.target.value);
  searchClients();
});