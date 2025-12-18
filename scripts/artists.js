function createArtistCard(artist) {
    return `
        <article id="artist-${artist.id}" class="artist-card">
            <a href="artist.html?id=${artist.id}" class="artist-card__link">
                <img src="${artist.image}" alt="${artist.name}" class="artist-card__image">
                <div class="artist-card__content">
                    <h3 class="artist-card__name">${artist.name}</h3>
                    <span class="artist-card__direction">${artist.direction}</span>
                </div>
            </a>
        </article>
    `;
}

function renderArtists() {
    const artistsGrid = document.querySelector('.artists-grid');
    if (!artistsGrid) {
        return;
    }
    
    const cardsHTML = artists.map(createArtistCard).join('');
    artistsGrid.innerHTML = cardsHTML;
}

renderArtists();
