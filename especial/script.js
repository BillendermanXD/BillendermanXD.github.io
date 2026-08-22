const postsContainer = document.getElementById('posts');
const posts = window.hakinovCatalogo?.especial || [];
const backgroundVideo = document.getElementById('specialBackgroundVideo');
const backgroundVideos = [
    'videos/Official Minecraft Trailer(720P_HD).mp4',
    'videos/Village _ Pillage_ Official Trailer(720P_HD).mp4',
    'videos/Minecraft Trails _ Tales Update_ Official Launch Trailer(720P_HD).mp4',
    'videos/Caves _ Cliffs Update_ Part I – Official Trailer(720P_HD).mp4'
];
let backgroundVideoIndex = 0;

function playNextBackgroundVideo() {
    backgroundVideoIndex = (backgroundVideoIndex + 1) % backgroundVideos.length;
    backgroundVideo.src = backgroundVideos[backgroundVideoIndex];
    backgroundVideo.play().catch(() => {});
}

backgroundVideo.addEventListener('ended', playNextBackgroundVideo);

function resourcePath(path) {
    if (!path || /^(https?:|data:|\/)/i.test(path)) return path;
    if (path.startsWith('especial/')) return `../${path.slice('especial/'.length)}`;
    return `../${path}`;
}

function addLink(container, label, url, download = false) {
    if (!url) return;
    const link = document.createElement('a');
    link.className = 'post-link';
    link.href = resourcePath(url);
    link.textContent = label;
    if (download) link.setAttribute('download', '');
    if (/^https?:/i.test(url)) {
        link.target = '_blank';
        link.rel = 'noreferrer';
    }
    container.appendChild(link);
}

function createPost(post) {
    const article = document.createElement('article');
    article.className = 'post';
    const cover = post.portada ? document.createElement('img') : null;
    if (cover) {
        cover.className = 'post-cover';
        cover.src = resourcePath(post.portada);
        cover.alt = post.titulo || 'Portada de la entrada';
        article.appendChild(cover);
    }

    const content = document.createElement('div');
    content.className = 'post-body';
    const title = document.createElement('h2');
    title.textContent = post.titulo || 'Sin titulo';
    const summary = document.createElement('p');
    summary.className = 'post-summary';
    summary.textContent = post.resumen || '';
    const text = document.createElement('p');
    text.className = 'post-text';
    text.textContent = post.contenido || '';
    content.append(title, summary, text);

    [...(post.imagenes || []), ...(post.screenshots || [])].forEach((imagePath, index) => {
        const image = document.createElement('img');
        image.className = index < (post.imagenes || []).length ? 'tutorial-image' : 'screenshot-image';
        image.src = resourcePath(imagePath);
        image.alt = index < (post.imagenes || []).length ? 'Imagen del tutorial' : 'Screenshot del proyecto';
        image.loading = 'lazy';
        content.appendChild(image);
    });

    const links = document.createElement('div');
    links.className = 'post-links';
    addLink(links, 'Descargar', post.descarga, true);
    addLink(links, 'Abrir enlace directo', post.enlace);
    content.appendChild(links);

    if ((post.comentarios || []).length) {
        const comments = document.createElement('div');
        comments.className = 'comments';
        const heading = document.createElement('h3');
        heading.textContent = 'Comentarios';
        comments.appendChild(heading);
        post.comentarios.forEach(comment => {
            const item = document.createElement('p');
            item.textContent = comment;
            comments.appendChild(item);
        });
        content.appendChild(comments);
    }
    article.appendChild(content);
    return article;
}

if (posts.length) {
    postsContainer.append(...posts.map(createPost));
} else {
    postsContainer.innerHTML = '<p class="empty-posts">Todavía no hay entradas. Añade la primera desde Hakinov Studio.</p>';
}
