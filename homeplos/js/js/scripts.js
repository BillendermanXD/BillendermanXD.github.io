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

async function searchFiles() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  searchResult.innerHTML = '';

  if (!searchTerm) {
    return;
  }

  const files = await fetchData('/acticulos/all.json');
  const matches = files.filter(item =>
    item && item.name && item.path && item.name !== '#' &&
    item.name.toLowerCase().includes(searchTerm)
  );

  if (matches.length === 0) {
    searchResult.innerHTML = '<li>No se encontraron archivos.</li>';
    return;
    }

  matches.forEach(item => {
    const listItem = document.createElement('li');
    const link = document.createElement('a');
    link.href = item.path;
    link.textContent = item.name;
    listItem.appendChild(link);
    searchResult.appendChild(listItem);
  });
}

searchInput.addEventListener('input', searchFiles);