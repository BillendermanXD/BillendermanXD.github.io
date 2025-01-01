const searchInput = document.getElementById('searchInput');
const searchResult = document.getElementById('searchResult');

async function fetchData(path) {
    try {
      const response = await fetch(path);
      return await response.json();
    } catch (error) {
      console.error("Error fetching JSON:", error);
      return []; // Return empty array on error
    }
  }

searchInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        const searchTerm = searchInput.value.toLowerCase();
        searchResult.innerHTML = ''; // Clear previous results

        // Fetch data from multiple JSON files
        Promise.all([
            fetchData('/acticulos/clientes.json'),
            fetchData('/home/acticulos/data2.json') // Add more paths as needed
        ]).then(dataArrays => {
            const allData = dataArrays.flat(); // Flatten the array of arrays

            const filteredData = allData.filter(item => item.name.toLowerCase().includes(searchTerm));
            filteredData.forEach(item => {
                const listItem = document.createElement('li');
                const link = document.createElement('a');
                link.href = item.path;
                link.textContent = item.name;
                listItem.appendChild(link);
                searchResult.appendChild(listItem);
            });
        });
    }
});