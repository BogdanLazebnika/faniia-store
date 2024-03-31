// Получаем id выбранного продукта из URL
const urlParams = new URLSearchParams(window.location.search);
const selectedProductId = urlParams.get('id');

// Находим выбранный продукт по его id в массиве CATALOG
const selectedProduct = CATALOG.find(product => product.id === selectedProductId);

// Функция для отображения информации о продукте на странице с выбором размера
function displayProductInfo(product) {
    const isProductInSavedCart = isProductSaved(product.id);
    const buttonImgSrc = isProductInSavedCart ? "asets/imgs/icons8-heart-off-like.png" : "asets/imgs/icons8-heart-on-like.png";
    const productContainer = document.getElementById('product-container');


     // Проверка наличия дополнительных изображений или наличия только одного изображения
    const hasAdditionalImages = product.additionalImages && product.additionalImages.length > 0;
    const isSingleImage = !hasAdditionalImages;
    
    if (!productContainer) {
        console.error("Product container not found!");
        return;
    }
    // Создаем HTML для стрелок и добавляем их в основной контейнер с изображением
   const arrowHTML = `
    <div class="arrow-container">
        ${hasAdditionalImages ? '<span class="arrow left-arrow" onclick="changeImageByArrow(-1)">&#10094;</span>' : ''}
        ${hasAdditionalImages ? '<span class="arrow right-arrow" onclick="changeImageByArrow(1)">&#10095;</span>' : ''}
    </div>
`;

// Определение наличия скидки
const hasDiscount = product.discount !== undefined && product.discount !== "";

// Расчет процента скидки
const discountPercentage = hasDiscount ? ((product.price - product.discount) / product.price * 100).toFixed(0) : 0;


// Добавляем HTML-разметку для отображения информации о продукте
const productHTML = `
<div class="product-details">
    <div class="product-cart-additional">

        <div id="modal" class="modal">
            <div class="modal_container">
                <span class="close" onclick="closeModal()">&times;</span>
                <div class="modal-img-container">
                    <img class="modal-content" id="modal-image">
                    <button id="prev-image-button" class="left-prev-image">&#10094;</button>
                    <button id="next-image-button" class="right-prev-image">&#10095;</button>
                </div>
            </div>
        </div>

        <div class="additional-images">
            <img src="${product.img}" alt="${product.name}" class="additional-image" onclick="changeMainImage(0)">
            ${product.additionalImages && product.additionalImages.length > 0 ? product.additionalImages.map((image, index) => `
                <img src="${image}" alt="${product.name}" class="additional-image" onclick="changeMainImage(${index + 1})">
            `).join('') : ''}
        </div>
    
        <div class="main-image-container">
            <div class="products__img__container">
            ${discountPercentage !== '0' && hasDiscount ? `<p class="discount-per-cent">-${discountPercentage}%</p>` : ''}
                <div class="saved_products-button">
                    <img src="${buttonImgSrc}" onclick="toggleSavedCart('${product.id}')" data-product-id="${product.id}">
                </div>
                <img src="${product.img}" alt="${product.name}" id="main-product-image" class="main-product-image" onclick="openImage()">
                <div class="arrow-container">
                    <div class="left-arrow-container no-select"><span class="arrow left-arrow" onclick="changeImageByArrow(-1)">&#10094;</span></div>
                    <div class="right-arrow-container no-select"><span class="arrow right-arrow" onclick="changeImageByArrow(1)">&#10095;</span></div>
                </div>
            </div>
        </div>



        <div class="information_products">
        <div class="products-cart_name">
            <h3>${product.name}</h3>
        </div>
        
        <!-- Добавляем отображение артикула, категории и бренда -->
        <div class="id-brand-info">
            <span>Артикул: ${product.type}</span>
            <span>Категорія: ${product.typeClot}</span>
            <span>Бренд: ${product.brand }</span>
        </div>
        <!-- Добавляем логику для отображения цены и скидки -->
        <div class="price__products-container_carts">
            <p class="product__price_not_discount">${hasDiscount ? `<span style="color: blac; text-decoration: line-through;" class="product__price_yes_discount">${product.price} Грн.</span>` : `${product.price} Грн.`}</p>
            ${hasDiscount ? `<p style="color: red;" class="products__discount_price">${product.discount} Грн.</p>` : ''}
            ${hasDiscount ? `<p class="discount-per-cent">${discountPercentage}%</p>` : ''}
        </div>
        

        <div>


        <div class="size_products-container">
    <p>Розмір 
        <div id="size-buttons">
            <button class="size-button">${createSizeButtons(product.size)}</button>
        </div>
    </p>
</div>  
        <div>
            <p>Кольори </p>
            <div id="related-products-container" class="related-products-container"></div>
            </div>
            <div class="button_container-products">
            <button id="add-to-cart-btn" onclick="addToCart('${product.id}')" disabled>Add to Cart</button>
            </div>
        </div>
    </div>
</div>
<p>Description: ${product.description}</p>
</div>
`;

    // Добавляем HTML-разметку на страницу
    productContainer.innerHTML = productHTML;
}


// Если продукт найден, отображаем его информацию на странице и связанные продукты
if (selectedProduct) {
    displayProductInfo(selectedProduct);
    
    // Отображаем связанные продукты, если тип не равен 1
    if (selectedProduct.type !== 1) {
        displayRelatedProducts(selectedProduct.type);
    } else {
        console.log("Product type 1, no related products displayed.");
    }
} else {
    console.error("Selected product not found!");
}

// Функция для отображения маленьких картинок и ссылок на страницу продукта с тем же типом
function displayRelatedProducts(productType) {
    const relatedProductsContainer = document.getElementById('related-products-container');
    if (!relatedProductsContainer) {
        console.error("Related products container not found!");
        return;
    }

    // Фильтруем каталог, чтобы найти продукты с тем же типом, но с другими id
    const relatedProducts = CATALOG.filter(product => product.type === productType && product.id !== selectedProductId);

    // Создаем HTML-разметку для каждого связанного продукта
    const relatedProductsHTML = relatedProducts.map(product => `
        <div class="related-product">
            
            <a href="productsCard.html?id=${product.id}">
                <img src="${product.img}" alt="${product.name}">
                
            </a>
        </div>
    `).join('');

    // Добавляем HTML-разметку на страницу
    relatedProductsContainer.innerHTML = relatedProductsHTML;
}








/// Функция для отображения предыдущего изображения в модальном окне
function prevModalImage() {
    const modalImage = document.getElementById('modal-image');
    const currentSrc = modalImage.src;
    const additionalImages = document.querySelectorAll('.additional-image');
    let currentIndex = -1;

    // Находим индекс текущего изображения в массиве дополнительных изображений
    additionalImages.forEach((image, index) => {
        if (currentSrc === image.src) {
            currentIndex = index;
        }
    });

    // Если текущее изображение не найдено, выходим из функции
    if (currentIndex === -1) {
        console.error("Current image not found in additional images!");
        return;
    }

    // Определяем индекс предыдущего изображения с учетом кольцевого цикла
    const prevIndex = (currentIndex - 1 + additionalImages.length) % additionalImages.length;

    // Обновляем изображение в модальном окне
    modalImage.src = additionalImages[prevIndex].src;
}





// Функция для отображения следующего изображения в модальном окне
function nextModalImage() {
    const modalImage = document.getElementById('modal-image');
    const currentSrc = modalImage.src;
    const additionalImages = document.querySelectorAll('.additional-image');
    let currentIndex = -1;

    // Находим индекс текущего изображения в массиве дополнительных изображений
    additionalImages.forEach((image, index) => {
        if (currentSrc === image.src) {
            currentIndex = index;
        }
    });

    // Если текущее изображение не найдено, выходим из функции
    if (currentIndex === -1) {
        console.error("Current image not found in additional images!");
        return;
    }

    // Определяем индекс следующего изображения с учетом кольцевого цикла
    const nextIndex = (currentIndex + 1) % additionalImages.length;

    // Обновляем изображение в модальном окне
    modalImage.src = additionalImages[nextIndex].src;
}

// Функція, яка відкриває модальне вікно та додає обробники подій для кнопок перегортання зображень
function openImage()  {
    // Находим изображение по его ID
    const mainImage = document.getElementById('main-product-image');
    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modal-image');

    // Получаем URL изображения
    const imageUrl = mainImage.src;

    // Отображаем модальное окно
    modal.style.display = "block";

    // Отображаем выбранное изображение внутри модального окна
    modalImage.src = imageUrl;

    // Додаємо обробник події для кнопки "Попереднє зображення"
    document.getElementById('prev-image-button').addEventListener('click', prevModalImage);

    // Додаємо обробник події для кнопки "Наступне зображення"
    document.getElementById('next-image-button').addEventListener('click', nextModalImage);
}
// Кнопка закриття модального вікна
function closeModal() {
    // Находим модальное окно по его ID
    const modal = document.getElementById('modal');

    // Скрываем модальное окно
    modal.style.display = "none";
}






// Функція для обробки події торкання по зображенню
function handleTouchStart() {
    // Показуємо стрілки при торканні
    showArrows();
}

// Функція для обробки події завершення торкання по зображенню
function handleTouchEnd() {
    // Приховуємо стрілки при завершенні торкання
    hideArrows();
}





// Функция для смены главного изображения при клике на дополнительное изображение
function changeMainImage(index) {
    const mainImage = document.getElementById('main-product-image');
    const additionalImages = document.querySelectorAll('.additional-image');
    if (index >= 0 && index < additionalImages.length) {
        mainImage.src = additionalImages[index].src;
    }
}
// Функция для смены изображений при нажатии на стрелки
function changeImageByArrow(direction) {
    const mainImage = document.getElementById('main-product-image');
    const additionalImages = document.querySelectorAll('.additional-image');
    let currentIndex = 0;

    // Проверяем, является ли основное изображение одним из дополнительных
    const isMainImageAdditional = Array.from(additionalImages).some((image, index) => {
        if (mainImage.src === image.src) {
            currentIndex = index;
            return true;
        }
        return false;
    });

    let nextIndex;

    if (isMainImageAdditional) {
        // Если основное изображение является одним из дополнительных, листаем по ним
        nextIndex = currentIndex + direction;
        if (nextIndex < 0) {
            nextIndex = additionalImages.length - 1;
        } else if (nextIndex >= additionalImages.length) {
            nextIndex = 0;
        }
    } else {
        // Если основное изображение - это изображение товара, листаем по дополнительным
        nextIndex = direction === -1 ? additionalImages.length - 1 : 0;
    }

    mainImage.src = additionalImages[nextIndex].src;
}





// Функція для перевірки, чи є продукт в обраному
function isProductSaved(productId) {
    const savedCart = JSON.parse(localStorage.getItem('savedCart')) || [];
    return savedCart.includes(productId);
}

function toggleSavedCart(productId) {
    const savedCart = JSON.parse(localStorage.getItem('savedCart')) || [];
    const productIndex = savedCart.indexOf(productId);

    if (productIndex === -1) {
        savedCart.push(productId);
    } else {
        savedCart.splice(productIndex, 1);
    }
    function displayCartProducts() {
        
    }
    localStorage.setItem('savedCart', JSON.stringify(savedCart));

    // Получаем изображение продукта по его идентификатору
    const buttonImg = document.querySelector(`[data-product-id="${productId}"]`);
    // Генерация случайного числа для параметра запроса


    if (buttonImg) {
        const currentImgSrc = buttonImg.src;

        if (currentImgSrc.includes("icons8-heart-on-like.png")) {
            buttonImg.src = "asets/imgs/icons8-heart-off-like.png";
            displayCartProducts();
        } else {
            buttonImg.src = "asets/imgs/icons8-heart-on-like.png";
            displayCartProducts();
        }
    }
    
}




// Отримати всі кнопки розміру
const sizeButtons = document.querySelectorAll('#size-buttons button');

// Додати обробник подій для кожної кнопки
sizeButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Додати клас "selected" при кліку на кнопку
        this.classList.add('selected');
    });
});

// Функция для создания кнопок размера
function createSizeButtons(sizes) {
    return sizes
        .split(' ')
        .map(size => `<button onclick="selectSize(this)">${size}</button>`)
        .join('');
}

// Функция для выбора размера
function selectSize(button) {
    const sizeButtons = document.querySelectorAll('#size-buttons button');
    sizeButtons.forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    addToCartBtn.disabled = false;
}

// Функция для добавления выбранного продукта в корзину с учетом размера
function addToCart(productId) {
    const selectedSizeButton = document.querySelector('#size-buttons button.selected');
    const selectedSize = selectedSizeButton ? selectedSizeButton.innerText : '';

    // Проверяем, выбран ли размер
    if (!selectedSize) {
        console.error("Please select a size!");
        return;
    }

    // Создаем объект с информацией о выбранном продукте
    const selectedProduct = {
        id: productId,
        size: selectedSize
    };

    // Получаем текущую корзину из localStorage
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    // Проверяем, есть ли уже товар с таким же id и размером в корзине
    const existingItemIndex = cartItems.findIndex(item => (
        item.id === productId &&
        item.size === selectedSize
    ));

    // Если такой товар уже есть в корзине, обновляем его количество
    if (existingItemIndex !== -1) {
        cartItems[existingItemIndex].quantity++; // увеличиваем количество товара
    } else {
        // Иначе добавляем новый товар в корзину
        selectedProduct.quantity = 1; // устанавливаем количество товара в 1
        cartItems.push(selectedProduct);
    }

    // Сохраняем обновленную корзину в localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));

    // Обновляем общее количество товаров
    updateTotalQuantity();
}










// Зберігаємо координати початку касання
let touchstartX = 0;
let touchendX = 0;

// Функція для обробки початку касання
function обробкаПочаткуКасання(event) {
    touchstartX = event.touches[0].clientX;
}

// Функція для обробки завершення касання
function обробкаЗавершенняКасання(event) {
    touchendX = event.changedTouches[0].clientX;
    handleSwipe(); // Обробляємо свайп
}

// Функція для обробки свайпа
function handleSwipe() {
    const swipeThreshold = 50; // Мінімальна відстань свайпу для визначення його як дійсного

    // Визначаємо різницю між початковою і кінцевою позиціями X
    const deltaX = touchendX - touchstartX;

    // Перевіряємо, чи був зроблений дійсний свайп, а не просто дотик
    if (Math.abs(deltaX) > swipeThreshold) {
        // Визначаємо напрямок свайпу
        if (deltaX > 0) {
            // Свайп вправо
            changeImageByArrow(-1);
        } else {
            // Свайп вліво
            changeImageByArrow(1);
        }
    }
}

// Додаємо обробники подій для касань
const mainImage = document.getElementById('main-product-image');
mainImage.addEventListener('touchstart', обробкаПочаткуКасання, false);
mainImage.addEventListener('touchend', обробкаЗавершенняКасання, false);
