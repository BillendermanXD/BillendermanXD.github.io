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
    console.error('Error al cargar los archivos:', error);
    return [];
  }
}

function normalizeSearchText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '');
}

async function searchFiles() {
  const searchTerm = normalizeSearchText(searchInput.value);
  searchResult.innerHTML = '';

  if (!searchTerm) {
    return;
  }

  const files = await fetchData('acticulos/all.json');
  const catalogo = window.hakinovCatalogo || {};
  const catalogItems = [
    ...(catalogo.juegos || []).map(item => ({ ...item, category: 'Juego' })),
    ...(catalogo.clientes || []).map(item => ({ ...item, category: 'Cliente' }))
  ];
  const items = [
    ...files.map(item => ({
      ...item,
      name: item.name || item.title,
      path: item.path || item.url,
      image: item.imagen || 'Resorce/img/images.jpg',
      searchableText: `${item.name || ''} ${item.title || ''} ${item.content || ''}`,
      category: 'Contenido'
    })),
    ...catalogItems.map(item => ({
      ...item,
      name: item.nombre,
      path: item.pagina || item.url,
      image: item.imagen || 'Resorce/img/images.jpg',
      searchableText: `${item.nombre || ''} ${item.descripcion || ''}`
    }))
  ];
  const matches = items.filter(item =>
    item && item.name && item.path && item.name !== '#' &&
    normalizeSearchText(item.searchableText).includes(searchTerm)
  );

  if (matches.length === 0) {
    searchResult.innerHTML = '<li>No se encontraron archivos.</li>';
    return;
    }

  matches.forEach(item => {
    const listItem = document.createElement('li');
    const link = document.createElement('a');
    const image = document.createElement('img');
    link.href = item.pagina || item.path;
    image.src = item.image;
    image.alt = '';
    image.loading = 'lazy';
    link.append(image, document.createTextNode(item.name));
    if (!item.pagina && item.tipoUrl === 'externa') {
      link.target = '_blank';
      link.rel = 'noreferrer';
    }
    listItem.appendChild(link);
    searchResult.appendChild(listItem);
  });
}

searchInput.addEventListener('input', searchFiles);