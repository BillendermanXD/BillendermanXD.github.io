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
    const projectPath = path.replace(/^\.\.\//, '');
    if (projectPath.startsWith('especial/')) return `../${projectPath}`;
    return `../${projectPath}`;
}

function setImageSource(image, path) {
    image.src = resourcePath(path);
    image.addEventListener('error', () => {
        if (image.dataset.fallback) return;
        image.dataset.fallback = 'true';
        image.src = resourcePath('Resorce/img/fondo.jpeg');
    });
}

function addLink(container, label, url, download = false) {
    if (!url) return;
    const normalizedUrl = /^www\./i.test(url) ? `https://${url}` : url;
    const link = document.createElement('a');
    link.className = 'post-link';
    link.href = resourcePath(normalizedUrl);
    link.textContent = label;
    if (download) link.setAttribute('download', '');
    if (/^https?:/i.test(normalizedUrl)) {
        link.target = '_blank';
        link.rel = 'noreferrer';
    }
    container.appendChild(link);
}

function addPostLinks(container, post) {
    addLink(container, 'Descargar', post.descarga, true);
    addLink(container, 'Abrir enlace directo', post.enlace);
    (post.enlaces || []).forEach(link => {
        const wrapper = document.createElement('div');
        wrapper.className = 'post-link-item';
        addLink(wrapper, link.etiqueta || 'Abrir enlace', link.url);
        if (link.comentario) {
            const note = document.createElement('small');
            note.textContent = link.comentario;
            wrapper.appendChild(note);
        }
        container.appendChild(wrapper);
    });
}

function createPost(post) {
    const article = document.createElement('article');
    article.className = 'post';
    const cover = document.createElement('img');
    cover.className = 'post-cover';
    setImageSource(cover, post.portada || 'Resorce/img/images.jpg');
    cover.alt = post.titulo || 'Portada de la entrada';
    article.appendChild(cover);

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
    const details = document.createElement('div');
    details.className = 'post-details';
    details.append(text);

    const screenshotItems = (post.screenshots || []).map(screenshot => typeof screenshot === 'string'
        ? { imagen: screenshot, comentario: '' }
        : { imagen: screenshot.imagen || screenshot.url || '', comentario: screenshot.comentario || '' });
    [...(post.imagenes || []).map(imagen => ({ imagen, comentario: '' })), ...screenshotItems].forEach((imageItem, index) => {
        const imageRow = document.createElement('div');
        imageRow.className = 'image-row';
        const imageFrame = document.createElement('div');
        imageFrame.className = 'image-frame';
        const image = document.createElement('img');
        image.className = index < (post.imagenes || []).length ? 'tutorial-image' : 'screenshot-image';
        setImageSource(image, imageItem.imagen);
        image.alt = index < (post.imagenes || []).length ? 'Imagen del tutorial' : 'Screenshot del proyecto';
        image.loading = 'lazy';
        imageFrame.appendChild(image);
        imageRow.appendChild(imageFrame);
        if (imageItem.comentario) {
            const note = document.createElement('div');
            note.className = 'image-comment';
            const noteLabel = document.createElement('span');
            noteLabel.className = 'image-comment-label';
            noteLabel.textContent = 'Nota';
            const noteText = document.createElement('p');
            noteText.textContent = imageItem.comentario;
            note.append(noteLabel, noteText);
            imageRow.appendChild(note);
        }
        details.appendChild(imageRow);
    });

    const links = document.createElement('div');
    links.className = 'post-links';
    addPostLinks(links, post);
    details.appendChild(links);

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
        details.appendChild(comments);
    }
    const toggle = document.createElement('button');
    toggle.className = 'read-more';
    toggle.type = 'button';
    toggle.textContent = 'Ver más';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.onclick = () => {
        const expanded = article.classList.toggle('expanded');
        toggle.textContent = expanded ? 'Ver menos' : 'Ver más';
        toggle.setAttribute('aria-expanded', String(expanded));
    };
    content.append(title, summary, toggle, details);
    article.appendChild(content);
    return article;
}

if (posts.length) {
    postsContainer.append(...posts.map(createPost));
} else {
    postsContainer.innerHTML = '<p class="empty-posts">Todavía no hay entradas. Añade la primera desde Hakinov Studio.</p>';
}
