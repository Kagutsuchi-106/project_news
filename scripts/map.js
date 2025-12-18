// Инициализация карты
let map;

function initMap() {
    // Создаем карту с центром в Тирасполе
    map = L.map('map-container').setView([46.8403, 29.6183], 13);

    // Добавляем слой карты OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);

    // Добавляем маркеры для каждой площадки
    venues.forEach(venue => {
        const venueEvents = events.filter(event => event.venueId === venue.id);
        
        // Создаем кастомную иконку
        const venueIcon = L.divIcon({
            className: 'venue-marker',
            html: `<div class="marker-pin" style="background-color: #E63946;">
                    <span class="marker-pin__text">${venue.type.charAt(0)}</span>
                  </div>`,
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            popupAnchor: [0, -40]
        });

        // Создаем маркер
        const marker = L.marker([venue.lat, venue.lng], { icon: venueIcon }).addTo(map);

        // Создаем popup с информацией о площадке и событиях
        const popupContent = createVenuePopup(venue, venueEvents);
        marker.bindPopup(popupContent, {
            maxWidth: 400,
            className: 'venue-popup'
        });

        // При клике на маркер открываем модальное окно с событиями
        marker.on('click', function() {
            showEventsModal(venue, venueEvents);
        });
    });
}

function createVenuePopup(venue, venueEvents) {
    const eventsCount = venueEvents.length;
    return `
        <div class="venue-popup-content">
            <h3 class="venue-popup-content__title">${venue.name}</h3>
            <p class="venue-popup-content__text"><strong>Тип:</strong> ${venue.type}</p>
            <p class="venue-popup-content__text"><strong>Событий:</strong> ${eventsCount}</p>
            <button class="show-events-btn" onclick="showEventsModalById(${venue.id})">
                Показать события
            </button>
        </div>
    `;
}

function showEventsModalById(venueId) {
    const venue = venues.find(v => v.id === venueId);
    const venueEvents = events.filter(event => event.venueId === venueId);
    showEventsModal(venue, venueEvents);
}

function showEventsModal(venue, venueEvents) {
    // Создаем модальное окно
    const modal = document.createElement('div');
    modal.className = 'events-modal';
    modal.innerHTML = `
        <div class="events-modal__content">
            <div class="events-modal__header">
                <h2 class="events-modal__title">${venue.name}</h2>
                <button class="close-modal" onclick="closeEventsModal()">&times;</button>
            </div>
            <div class="events-modal__body">
                ${venueEvents.length > 0 
                    ? `<div class="events-grid">${renderEventCards(venueEvents)}</div>`
                    : '<p>На этой площадке пока нет событий.</p>'
                }
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Закрытие по клику вне модального окна
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeEventsModal();
        }
    });
}

function renderEventCards(venueEvents) {
    return venueEvents.map(event => {
        const eventArtists = event.artistIds 
            ? event.artistIds.map(id => getArtistById(id)).filter(Boolean)
            : [];
        const artistsText = eventArtists.length > 0
            ? eventArtists.map(a => a.name).join(', ')
            : '';
        
        return `
            <div class="event-card-modal">
                <a href="event.html?id=${event.id}" class="event-card-modal__link">
                    <img src="${event.image}" alt="${event.alt}" class="event-card-modal__image">
                    <div class="event-card-modal__content">
                        <span class="event-card__type">${event.type}</span>
                        <h3 class="event-card-modal__title">${event.title}</h3>
                        <p class="event-card__date">${event.date}</p>
                        <p class="event-card__price">${event.price}</p>
                        ${artistsText ? `<p class="event-card-modal__artist">Художник${eventArtists.length > 1 ? 'и' : ''}: ${artistsText}</p>` : ''}
                    </div>
                </a>
            </div>
        `;
    }).join('');
}

function closeEventsModal() {
    const modal = document.querySelector('.events-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

// Инициализация карты после загрузки DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMap);
} else {
    initMap();
}

