function getArtistIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('id'));
}


function getEventsByArtistId(artistId) {
    return events.filter(event => event.artistIds && event.artistIds.includes(artistId));
}

function renderArtist() {
    const artistContent = document.getElementById('artist-content');
    if (!artistContent) {
        return;
    }

    const artistId = getArtistIdFromURL();
    if (!artistId) {
        artistContent.innerHTML = '<p>Художник не найден.</p>';
        return;
    }

    const artist = getArtistById(artistId);
    if (!artist) {
        artistContent.innerHTML = '<p>Художник не найден.</p>';
        return;
    }

    const artistEvents = getEventsByArtistId(artistId);
    
    const portfolioHTML = artist.portfolio && artist.portfolio.length > 0
        ? `
            <div class="artist-portfolio">
                <h3 class="section__title">Портфолио</h3>
                <div class="portfolio-grid">
                    ${artist.portfolio.map(work => `
                        <div class="portfolio-item">
                            <img src="${work.image}" alt="${work.title}" class="portfolio-item__image">
                            <div class="portfolio-item__content">
                                <h4 class="portfolio-item__title">${work.title}</h4>
                                <p class="portfolio-item__year">${work.year}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `
        : '';

    const eventsHTML = artistEvents.length > 0
        ? `
            <div class="artist-events">
                <h3 class="section__title">Мероприятия</h3>
                <div class="events-list">
                    ${artistEvents.map(event => `
                        <article class="event-item">
                            <h4 class="event-item__title">
                                <a href="event.html?id=${event.id}" class="event-item__link">${event.title}</a>
                            </h4>
                            <p class="event-item__type">${event.type}</p>
                            <p class="event-item__date">${event.date}</p>
                        </article>
                    `).join('')}
                </div>
            </div>
        `
        : '<p>У художника пока нет запланированных мероприятий.</p>';

    artistContent.innerHTML = `
        <div class="artist-profile">
            <div class="artist-profile__header">
                <img src="${artist.image}" alt="${artist.name}" class="artist-profile__image">
                <div class="artist-profile__info">
                    <h2 class="artist-profile__name">${artist.name}</h2>
                    <p class="artist-profile__direction">${artist.direction}</p>
                </div>
            </div>
            <div class="artist-profile__bio">
                <h3 class="section__title">Биография</h3>
                <p>${artist.bio}</p>
            </div>
            <div class="artist-profile__concept">
                <h3 class="section__title">Концепция</h3>
                <p>${artist.concept}</p>
            </div>
            ${portfolioHTML}
            ${eventsHTML}
        </div>
    `;
}

renderArtist();
