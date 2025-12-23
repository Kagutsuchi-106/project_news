// Коэффициенты для категорий билетов
const TICKET_COEFFICIENTS = {
    full: 1.0,
    student: 0.7,
    discount: 0.5,
};

function parsePrice(priceString) {
    const price = priceString.replace(/\s/g, '').replace('₽', '');
    return parseInt(price) || 0;
}

function getTicketCoefficient() {
    const category = getTicketCategory();
    return TICKET_COEFFICIENTS[category] || TICKET_COEFFICIENTS['full'];
}

function calculateBudget() {
    const favoriteEvents = getFavoriteEvents();
    const coefficient = getTicketCoefficient();

    if (favoriteEvents.length === 0) {
        return {
            events: [],
            total: 0,
            coefficient: coefficient,
        };
    }

    const eventsWithPrices = favoriteEvents.map((event) => {
        const basePrice = parsePrice(event.price);
        const finalPrice = Math.round(basePrice * coefficient);

        return {
            ...event,
            priceValue: basePrice,
            finalPrice: finalPrice,
        };
    });

    const total = eventsWithPrices.reduce(
        (sum, event) => sum + event.finalPrice,
        0,
    );

    return {
        events: eventsWithPrices,
        total: total,
        coefficient: coefficient,
    };
}

function getCategoryLabel(category) {
    const labels = {
        full: 'Полный билет',
        student: 'Студенческий',
        discount: 'Льготный',
    };
    return labels[category] || 'Полный билет';
}

function renderBudget() {
    const budgetContent = document.getElementById('budget-content');
    if (!budgetContent) {
        return;
    }

    const budget = calculateBudget();
    const category = getTicketCategory() || 'full';

    if (budget.events.length === 0) {
        budgetContent.innerHTML =
            '<p>У вас нет избранных мероприятий для расчета бюджета.</p>';
        return;
    }

    const eventsList = budget.events
        .map((event) => {
            const originalPrice = event.price;
            const finalPrice = event.finalPrice;
            const priceDisplay =
                finalPrice !== event.priceValue
                    ? `<span style="text-decoration: line-through; opacity: 0.6;">${originalPrice}</span> <strong>${finalPrice} ₽</strong>`
                    : `<strong>${finalPrice} ₽</strong>`;

            return `
            <article class="budget-item">
                <h3><a href="event.html?id=${event.id}">${event.title}</a></h3>
                <p><strong>Дата:</strong> ${event.date}</p>
                <p><strong>Стоимость:</strong> ${priceDisplay}</p>
            </article>
        `;
        })
        .join('');

    const categoryLabel = getCategoryLabel(category);
    const coefficientPercent = Math.round(budget.coefficient * 100);

    budgetContent.innerHTML = `
        <div id="budget-list">
            ${eventsList}
        </div>
        <div id="budget-total">
            <p class="budget-category-info">Категория: ${categoryLabel} (коэффициент ${budget.coefficient})</p>
            <h3>Общая стоимость: ${budget.total} ₽</h3>
        </div>
    `;
}

function initTicketCategorySelector() {
    const selector = document.getElementById('ticket-category-selector');
    if (!selector) {
        return;
    }

    // Устанавливаем сохраненное значение или значение по умолчанию
    const savedCategory = getTicketCategory();
    if (savedCategory) {
        selector.value = savedCategory;
    } else {
        selector.value = 'full';
        saveTicketCategory('full');
    }

    // Обработчик изменения категории
    selector.addEventListener('change', function () {
        const selectedCategory = this.value;
        saveTicketCategory(selectedCategory);
        renderBudget();
    });
}

// Инициализация при загрузке страницы
initTicketCategorySelector();
renderBudget();
