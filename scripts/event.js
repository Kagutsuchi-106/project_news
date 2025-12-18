function getEventIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('id'));
}


function renderEvent() {
    const eventContent = document.getElementById('event-content');
    if (!eventContent) {
        return;
    }

    const eventId = getEventIdFromURL();
    if (!eventId) {
        eventContent.innerHTML = '<p>Событие не найдено.</p>';
        return;
    }

    const event = getEventById(eventId);
    if (!event) {
        eventContent.innerHTML = '<p>Событие не найдено.</p>';
        return;
    }

    const eventArtists = event.artistIds 
        ? event.artistIds.map(id => getArtistById(id)).filter(Boolean)
        : [];
    
    const artistsLinks = eventArtists.length > 0
        ? eventArtists.map(artist => 
            `<a href="artist.html?id=${artist.id}" class="event-content__link">${artist.name}</a>`
          ).join(', ')
        : 'Не указаны';
    
    const venue = getVenueById(event.venueId);
    const venueLink = venue 
        ? `<a href="map.html#venue-${venue.id}" class="event-content__link">${venue.name}</a>`
        : 'Не указана';

    eventContent.innerHTML = `
        <h2 class="section__title">${event.title}</h2>
        <img src="${event.image}" alt="${event.alt}" style="width: 100%; max-width: 800px; height: auto; margin-bottom: 30px;">
        <div style="margin-bottom: 20px;">
            <span class="event-card__type">${event.type}</span>
        </div>
        <div style="margin-bottom: 20px;">
            <p><strong>Дата:</strong> ${event.date}</p>
            <p><strong>Цена:</strong> ${event.price}</p>
        </div>
        <div style="margin-bottom: 20px;">
            <p><strong>Художник${eventArtists.length > 1 ? 'и' : ''}:</strong> ${artistsLinks}</p>
            <p><strong>Площадка:</strong> ${venueLink}</p>
        </div>
        <div>
            <p>${event.description}</p>
        </div>
    `;
}

renderEvent();


