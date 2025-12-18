function createEventCard(event) {
    const isFav = isFavorite(event.id);
    const buttonText = isFav ? 'Удалить из избранного' : 'В избранное';
    const buttonClass = isFav ? 'favorite-btn favorite-btn--active' : 'favorite-btn';
    
    return `
        <div class="event-card-wrapper">
            <a href="event.html?id=${event.id}" class="event-card">
                <img src="${event.image}" alt="${event.alt}" class="event-card__image">
                <div class="event-card__content">
                    <h3 class="event-card__title">${event.title}</h3>
                    <span class="event-card__type">${event.type}</span>
                    <span class="event-card__date">${event.date}</span>
                    <span class="event-card__price">${event.price}</span>
                </div>
            </a>
            <button class="${buttonClass}" data-event-id="${event.id}">${buttonText}</button>
        </div>
    `;
}

function renderEvents() {
    const catalogGrid = document.querySelector('.catalog-grid');
    if (!catalogGrid) {
        return;
    }
    
    const cardsHTML = events.map(createEventCard).join('');
    catalogGrid.innerHTML = cardsHTML;
    
    const favoriteButtons = catalogGrid.querySelectorAll('.favorite-btn');
    favoriteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const eventId = parseInt(this.getAttribute('data-event-id'));
            toggleFavorite(eventId);
            renderEvents();
        });
    });
}

renderEvents();


