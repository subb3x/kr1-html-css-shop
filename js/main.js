// Получаем модальное окно по id.
const orderDialog = document.getElementById('order-dialog');

// Получаем все кнопки заказа в карточках товаров.
const orderButtons = document.querySelectorAll('.product-card__button');

// Получаем кнопку закрытия модального окна.
const closeDialogButton = document.getElementById('close-order-dialog');

// Получаем скрытое поле, в которое будет записан выбранный товар.
const selectedProductInput = document.getElementById('selected-product');

// Перебираем все кнопки «Заказать».
// На страницах без формы этот блок просто не выполняется.
if (orderDialog && selectedProductInput) {
  orderButtons.forEach((button) => {
    button.addEventListener('click', () => {
      // Получаем название товара из data-атрибута.
      const productName = button.dataset.product;

      // Записываем название товара в скрытое поле формы.
      selectedProductInput.value = productName;

      // Открываем модальное окно.
      orderDialog.showModal();
    });
  });
}

// Закрываем модальное окно по кнопке «Закрыть».
if (orderDialog && closeDialogButton) {
  closeDialogButton.addEventListener('click', () => {
    orderDialog.close();
  });
}

// Получаем форму заявки.
const orderForm = document.getElementById('order-form');

// Получаем сообщение об успешной отправке.
const successMessage = document.getElementById('success-message');

// Обрабатываем отправку формы.
if (orderForm && orderDialog && successMessage) {
  orderForm.addEventListener('submit', (event) => {
  // Отменяем стандартную отправку формы,
  // потому что backend пока не подключён.
  event.preventDefault();

  // Сбрасываем предыдущие признаки ошибок.
  const formElements = Array.from(orderForm.elements);

  formElements.forEach((element) => {
    if (element.willValidate) {
      element.removeAttribute('aria-invalid');
    }
  });

  // Проверяем встроенные HTML-ограничения формы.
  if (!orderForm.checkValidity()) {
    formElements.forEach((element) => {
      if (element.willValidate && !element.checkValidity()) {
        element.setAttribute('aria-invalid', 'true');
      }
    });

    // Показываем стандартные сообщения браузера.
    orderForm.reportValidity();
    return;
  }

  // Показываем сообщение об успешной отправке.
  successMessage.hidden = false;

  // Очищаем форму.
  orderForm.reset();

  // Закрываем модальное окно.
    orderDialog.close();
  });
}

// Фильтр каталога: категория и цена.
// На страницах без формы этот блок не выполняется.
const filtersForm = document.querySelector('.filters-form');
const catalogEmpty = document.getElementById('catalog-empty');

if (filtersForm) {
  const applyFilters = () => {
    const checked = [];

    filtersForm.querySelectorAll('input[name="category"]:checked').forEach((input) => {
      checked.push(input.value);
    });

    const priceFromInput = filtersForm.querySelector('#price-from');
    const priceToInput = filtersForm.querySelector('#price-to');
    const priceFrom = priceFromInput && priceFromInput.value ? Number(priceFromInput.value) : 0;
    const priceTo = priceToInput && priceToInput.value ? Number(priceToInput.value) : Infinity;

    const cards = document.querySelectorAll('.catalog-products .product-card');
    let visibleCount = 0;

    cards.forEach((card) => {
      const categoryMatches = checked.length === 0
        || checked.includes('all')
        || checked.includes(card.dataset.category);
      const price = Number(card.dataset.price);
      const priceMatches = price >= priceFrom && price <= priceTo;
      const isVisible = categoryMatches && priceMatches;

      card.hidden = !isVisible;

      if (isVisible) {
        visibleCount += 1;
      }
    });

    if (catalogEmpty) {
      catalogEmpty.hidden = visibleCount !== 0;
    }
  };

  filtersForm.addEventListener('submit', (event) => {
    event.preventDefault();
    applyFilters();
  });

  // Ссылка вида catalog.html?category=popular сразу отмечает фильтр.
  const params = new URLSearchParams(window.location.search);
  const categoryFromUrl = params.get('category');

  if (categoryFromUrl) {
    const categoryInput = filtersForm.querySelector(
      'input[name="category"][value="' + categoryFromUrl + '"]'
    );

    if (categoryInput) {
      categoryInput.checked = true;
      applyFilters();
    }
  }
}

// Картинка товара берётся из images по номеру в каталоге: 1.png или 1.jpg.
const productImages = document.querySelectorAll('[data-image]');

productImages.forEach((image) => {
  const number = image.dataset.image;

  image.addEventListener('error', () => {
    if (image.dataset.fallback !== 'jpg') {
      image.dataset.fallback = 'jpg';
      image.src = 'images/' + number + '.jpg';
      return;
    }

    image.remove();
  });

  image.src = 'images/' + number + '.png';
});

// Кнопка «Наверх» прокручивает страницу в начало.
const toTopButton = document.querySelector('.to-top');

if (toTopButton) {
  toTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}