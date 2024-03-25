// Об'єкт зі значеннями фільтрів за замовчуванням
let filters = JSON.parse(localStorage.getItem('filters')) || {
    type: 'all',
    minPrice: 1,
    maxPrice: Infinity,
    minSize: 'all',
    maxSize: 'all'
};


// Встановлення значень фільтрів з локального сховища
document.getElementById('filter-type').value = filters.type;
document.getElementById('filter-price-min').value = filters.minPrice;
document.getElementById('filter-price-max').value = filters.maxPrice;
document.getElementById('filter-size-min').value = filters.minSize;
document.getElementById('filter-size-max').value = filters.maxSize;

// Функція для застосування фільтрів та сортування
function applyFilters() {
    // Збереження вибраного сортування в локальному сховищі
    localStorage.setItem('sortBy', document.getElementById('sort-by').value);
    
    // Застосування фільтрів
    filters.type = document.getElementById('filter-type').value;
    filters.minPrice = parseFloat(document.getElementById('filter-price-min').value) || 1;
    filters.maxPrice = parseFloat(document.getElementById('filter-price-max').value) || Infinity;
    filters.minSize = document.getElementById('filter-size-min').value;
    filters.maxSize = document.getElementById('filter-size-max').value;
    localStorage.setItem('filters', JSON.stringify(filters));
    
    filterProducts();
}

// Функція для скидання фільтрів
function resetFilters() {
    filters = {
        type: 'all',
        minPrice: 1,
        maxPrice: Infinity,
        minSize: 'all',
        maxSize: 'all'
    };

    localStorage.removeItem('filters');

    resetFilterInputs();
    filterProducts();
}

// Функція для скидання введених значень фільтрів
function resetFilterInputs() {
    document.getElementById('filter-type').value = 'all';
    document.getElementById('filter-price-min').value = '';
    document.getElementById('filter-price-max').value = '';
    document.getElementById('filter-size-min').value = 'all';
    document.getElementById('filter-size-max').value = 'all';
}

// Функція для фільтрації продуктів
function filterProducts() {
    const selectedType = filters.type;
    const minPrice = filters.minPrice;
    let maxPrice = filters.maxPrice; // Змінна для збереження максимальної ціни
    const minSize = filters.minSize;
    const maxSize = filters.maxSize;
    const sortBy = document.getElementById('sort-by').value; // Отримання значення сортування

    // Фільтрація за типом
    let filteredProducts = CATALOG;
    if (selectedType !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.typeClot === selectedType);
    }

    // Фільтрація за ціною
    filteredProducts = filteredProducts.filter(product => {
        const priceWithDiscount = product.discount && product.discount > 0 ? product.discount : product.price;
        return priceWithDiscount >= minPrice && priceWithDiscount <= maxPrice;
    });

    // Фільтрація за розміром
    if (minSize !== 'all' && maxSize !== 'all') {
        filteredProducts = filteredProducts.filter(product => {
            const sizes = product.size.split(' ').map(size => parseInt(size));
            return sizes.some(size => size >= minSize && size <= maxSize);
        });
    }

    // Отримання максимальної знижки серед усіх продуктів
    const maxDiscount = Math.max(...filteredProducts.map(product => product.discount || 0));

    // Перерахунок максимальної ціни з урахуванням максимальної знижки
    if (maxDiscount > 0 && maxPrice === Infinity) {
        maxPrice = Math.max(...filteredProducts.map(product => product.price - (product.discount || 0)));
    }

    // Сортування і відображення відфільтрованих і відсортованих продуктів
    displayProducts(sortProducts(filteredProducts, sortBy));
}

// Функція для сортування продуктів
function sortProducts(products, sortBy) {
    switch (sortBy) {
        case 'newest':
            return products.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
        case 'oldest':
            return products.sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded));
        case 'lowest':
            return products.sort((a, b) => {
                const aPrice = a.discount && a.discount > 0 ? a.discount : a.price;
                const bPrice = b.discount && b.discount > 0 ? b.discount : b.price;
                return aPrice - bPrice;
            });
        case 'highest':
            return products.sort((a, b) => {
                const aPrice = a.discount && a.discount > 0 ? a.discount : a.price;
                const bPrice = b.discount && b.discount > 0 ? b.discount : b.price;
                return bPrice - aPrice;
            });
        case 'discount':
            return products.sort((a, b) => b.discount - a.discount); // Сортування за скидкою
        default:
            return products;
    }
}

// Отримання унікальних значень типів продуктів
const uniqueTypes = [...new Set(CATALOG.map(product => product.typeClot))];

// Створення випадаючого списку на основі унікальних типів продуктів
const filterTypeSelect = document.getElementById('filter-type');
uniqueTypes.forEach(type => {
    const option = document.createElement('option');
    option.value = type;
    option.textContent = type;
    filterTypeSelect.appendChild(option);
});
filterTypeSelect.addEventListener('change', applyFilters);

// Отримання унікальних значень розмірів і сортування їх за зростанням
const allSizes = CATALOG.flatMap(product => product.size.split(' ')).map(size => parseInt(size));
const uniqueSizes = [...new Set(allSizes)].sort
((a, b) => a - b);

// Створення випадаючого списку на основі унікальних розмірів
const filterSizeSelectMin = document.getElementById('filter-size-min');
const filterSizeSelectMax = document.getElementById('filter-size-max');




uniqueSizes.forEach(size => {
    const option = document.createElement('option');
    option.value = size;
    option.textContent = size;
    filterSizeSelectMin.appendChild(option.cloneNode(true));
    filterSizeSelectMax.appendChild(option.cloneNode(true));
});
filterSizeSelectMin.addEventListener('change', applySizeFilter);
filterSizeSelectMax.addEventListener('change', applySizeFilter);

function applySizeFilter() {
    const selectedMinSize = document.getElementById('filter-size-min').value;
    const selectedMaxSize = document.getElementById('filter-size-max').value;

    if (selectedMinSize !== 'all' && selectedMaxSize !== 'all') {
        if (selectedMinSize === selectedMaxSize) {
            filters.minSize = selectedMinSize;
            filters.maxSize = selectedMaxSize;
        } else {
            // Якщо вибрано обидва значення, поверніться до значень за замовчуванням
            filters.minSize = 'all';
            filters.maxSize = 'all';
        }
    } else {
        filters.minSize = selectedMinSize;
        filters.maxSize = selectedMaxSize;
    }

    localStorage.setItem('filters', JSON.stringify(filters));

    filterProducts();
}

// Отримання значення сортування з локального сховища
const savedSortBy = localStorage.getItem('sortBy');
if (savedSortBy) {
    document.getElementById('sort-by').value = savedSortBy;
}
document.getElementById('sort-by').addEventListener('change', applyFilters);

// Функція для створення HTML-розмітки карточки продукта
function createProductCard(product) {
    const isProductInSavedCart = isProductSaved(product.id);
    const buttonImgSrc = isProductInSavedCart ? "asets/imgs/icons8-heart-off-like.png" : "asets/imgs/icons8-heart-on-like.png";
    const discountPercentage = Math.round((1 - (product.discount / product.price)) * 100); // Розрахунок відсотку знижки
    const hasDiscount = product.discount && product.discount > 0;

    return `
        <div class="products-card__container">
            <div class="product-card" id="${product.id}">
                <div class="saved_products-button">
                    <img src="${buttonImgSrc}" onclick="toggleSavedCart('${product.id}')">
                </div>
                <div class="prducts__card-container__img">     
                    <img class="prducts__card__img" src="${product.img}" alt="${product.name}" onclick="redirectToProduct('${product.id}')">
               </div>
                <div class="botom_container_products">
                    <h3>${product.name}</h3>
                    <p>Бренд: ${product.brand}</p>
                    <p>Тип: ${product.typeClot}</p>
                    <p>Ціна: ${hasDiscount ? `<span style="color: red; text-decoration: line-through;">$${product.price}</span>` : `$${product.price}`}</p>
                    ${hasDiscount ? `<p style="color: red;">Ціна зі знижкою: $${product.discount}</p>` : ''}
                    ${hasDiscount ? `<p>Знижка: ${discountPercentage}%</p>` : ''}
                    <p>Розмір: ${product.size}</p>
                    <a href="productsCard.html?id=${product.id}">Деталі</a>
                </div>
            </div>
        </div>`;
}

// Функція для перевірки, чи є продукт в обраному
function isProductSaved(productId) {
    const savedCart = JSON.parse(localStorage.getItem('savedCart')) || [];
    return savedCart.includes(productId);
}

// Функція для додавання або видалення продукта з обраного
function toggleSavedCart(productId) {
    const savedCart = JSON.parse(localStorage.getItem('savedCart')) || [];
    const productIndex = savedCart.indexOf(productId);

    if (productIndex === -1) {
        // Якщо продукт не знайдено в обраному, додайте його
        savedCart.push(productId);
    } else {
        // Якщо продукт знайдено в обраному, видаліть його
        savedCart.splice(productIndex, 1);
    }

    // Оновіть дані в localStorage
    localStorage.setItem('savedCart', JSON.stringify(savedCart));

    // Перемалювати карточки продуктів
    filterProducts();
}

// Функція для переходу на сторінку продукта
function redirectToProduct(productId) {
    window.location.href = `productsCard.html?id=${productId}`;
}

// Функція для виведення продуктів з масиву в HTML
function displayProducts(products) {
    const productsContainer = document.getElementById('products-container');
    if (!productsContainer) {
        console.error("Контейнер продуктів не знайдено!");
        return;
    }

    // Очистити контейнер перед додаванням нових продуктів
    productsContainer.innerHTML = '';

    // Створити і додати карточки продуктів в контейнер
    products.forEach(product => {
        const productCardHTML = createProductCard(product);
        productsContainer.innerHTML += productCardHTML;
    });
}

// Отримання значень з локального сховища
const savedFilters = JSON.parse(localStorage.getItem('filters'));
if (savedFilters) {
    document.getElementById('filter-type').value = savedFilters.type;
    document.getElementById('filter-price-min').value = savedFilters.minPrice;
    document.getElementById('filter-price-max').value  = savedFilters.maxPrice;
    document.getElementById('filter-size-min').value = savedFilters.minSize;
    document.getElementById('filter-size-max').value = savedFilters.maxSize;
}

// Викликати функцію applyFilters() при завантаженні сторінки
window.addEventListener('load', () => {
    applyFilters();
});

// Викликати функцію для виведення продуктів на сторінку
displayProducts(CATALOG);