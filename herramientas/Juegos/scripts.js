const gamesGrid = document.getElementById('gamesGrid');
const gamesEmpty = document.getElementById('gamesEmpty');
const gameSearch = document.getElementById('gameSearch');
const gamesNoResults = document.getElementById('gamesNoResults');
const gamesPagination = document.getElementById('gamesPagination');
const games = window.hakinovCatalogo?.juegos || [];
const gamesPerPage = 20;
let currentPage = 1;

function assetPath(path) {
	if (!path || /^(data:|https?:|\/)/i.test(path)) return path;
	return `../${path.replace(/^\.\.\//, '')}`;
}

function createGameCard(game) {
	const link = document.createElement('a');
	link.className = 'game-card';
	link.href = game.pagina ? `../${game.pagina}` : (game.url || '#');
	link.textContent = '';

	if (!game.pagina && game.tipoUrl === 'externa') {
		link.target = '_blank';
		link.rel = 'noreferrer';
	}

	const image = document.createElement('img');
	image.src = assetPath(game.imagen);
	image.alt = `Portada de ${game.nombre}`;
	image.addEventListener('error', () => { image.src = assetPath('Resorce/img/fondo.jpeg'); });
	applyImageLayout(image, link, game.imagen);

	const content = document.createElement('span');
	content.className = 'game-card-content';

	const name = document.createElement('strong');
	name.textContent = game.nombre;
	content.appendChild(name);

	if (game.descripcion) {
		const description = document.createElement('small');
		description.textContent = game.descripcion;
		content.appendChild(description);
	}

	link.append(image, content);
	return link;
}

function applyImageLayout(image, card, imageUrl) {
	const isPng = /^data:image\/png|\.png(?:[?#]|$)/i.test(imageUrl || '');

	if (isPng) {
		image.classList.add('png-cover');
		card.classList.add('png-cover-card');
	}

	image.addEventListener('load', () => {
		const isVeryWide = image.naturalWidth / image.naturalHeight > 1.8;
		const isVeryTall = image.naturalHeight / image.naturalWidth > 1.8;

		if (isVeryWide || isVeryTall) {
			image.classList.add('preserve-ratio');
			card.classList.add('preserve-ratio-card');
		}
	});
}

function renderPagination(totalPages) {
	gamesPagination.replaceChildren();
	if (totalPages <= 1) return;

	const previous = document.createElement('button');
	previous.textContent = '<';
	previous.disabled = currentPage === 1;
	previous.onclick = () => { currentPage -= 1; renderGames(gameSearch.value); };
	gamesPagination.appendChild(previous);

	for (let page = 1; page <= totalPages; page += 1) {
		const button = document.createElement('button');
		button.textContent = page;
		button.className = page === currentPage ? 'active' : '';
		button.onclick = () => { currentPage = page; renderGames(gameSearch.value); };
		gamesPagination.appendChild(button);
	}

	const next = document.createElement('button');
	next.textContent = '>';
	next.disabled = currentPage === totalPages;
	next.onclick = () => { currentPage += 1; renderGames(gameSearch.value); };
	gamesPagination.appendChild(next);

	const pageInput = document.createElement('input');
	pageInput.type = 'number';
	pageInput.min = '1';
	pageInput.max = String(totalPages);
	pageInput.value = String(currentPage);
	pageInput.title = 'Ir a la página';
	pageInput.setAttribute('aria-label', 'Ir a la página');
	pageInput.onchange = () => {
		const requestedPage = Number(pageInput.value);
		currentPage = Math.min(Math.max(requestedPage || 1, 1), totalPages);
		renderGames(gameSearch.value);
	};
	gamesPagination.appendChild(pageInput);
}

function renderGames(searchTerm = '') {
	const normalizedTerm = searchTerm.trim().toLowerCase();
	const filteredGames = games.filter(game => {
		const searchableText = `${game.nombre || ''} ${game.descripcion || ''}`.toLowerCase();
		return searchableText.includes(normalizedTerm);
	});

	const totalPages = Math.ceil(filteredGames.length / gamesPerPage);
	currentPage = Math.min(currentPage, Math.max(totalPages, 1));
	const start = (currentPage - 1) * gamesPerPage;
	gamesGrid.replaceChildren(...filteredGames.slice(start, start + gamesPerPage).map(createGameCard));
	gamesNoResults.hidden = filteredGames.length > 0 || games.length === 0;
	renderPagination(totalPages);
}

if (games.length > 0) {
	gamesEmpty.hidden = true;
	renderGames();
}

gameSearch.addEventListener('input', event => {
	currentPage = 1;
	renderGames(event.target.value);
});

