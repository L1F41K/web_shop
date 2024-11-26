// Получаем все слайдеры
const sliders = document.querySelectorAll('.slider-container')

sliders.forEach(slider => {
	const slides = slider.querySelector('.slides')
	const slide = slider.querySelectorAll('.slide')
	const prevBtn = slider.querySelector('.prev')
	const nextBtn = slider.querySelector('.next')

	let currentIndex = 0

	// Устанавливаем начальное положение
	slides.style.transform = `translateX(-${100 * currentIndex}%)`

	function moveToSlide(index) {
		slides.style.transition = 'transform 0.5s ease-in-out'
		slides.style.transform = `translateX(-${100 * index}%)`
	}

	function nextSlide() {
		currentIndex = (currentIndex + 1) % slide.length
		moveToSlide(currentIndex)
	}

	function prevSlide() {
		currentIndex = (currentIndex - 1 + slide.length) % slide.length
		moveToSlide(currentIndex)
	}

	prevBtn.addEventListener('click', prevSlide)
	nextBtn.addEventListener('click', nextSlide)
})

// CART
document.addEventListener('DOMContentLoaded', () => {
	const cartIcon = document.querySelector('.logo-cart')
	const cartPanel = document.querySelector('.cart-panel')
	const cartOverlay = document.querySelector('.cart-overlay')
	const cartClose = document.querySelector('.cart-close')

	const openCart = () => {
		cartPanel.classList.add('active')
		cartOverlay.classList.add('active')
		cartPanel.classList.remove('hidden')
		cartOverlay.classList.remove('hidden')
	}

	const closeCart = () => {
		cartPanel.classList.remove('active')
		cartOverlay.classList.remove('active')
		setTimeout(() => {
			cartPanel.classList.add('hidden')
			cartOverlay.classList.add('hidden')
		}, 300) // Ждем завершения анимации
	}

	// Открытие корзины при клике на значок
	cartIcon.addEventListener('click', openCart)

	// Закрытие корзины при клике на крестик
	cartClose.addEventListener('click', closeCart)

	// Закрытие корзины при клике за её пределами
	cartOverlay.addEventListener('click', closeCart)
})

document.addEventListener('DOMContentLoaded', () => {
	const cartPanel = document.querySelector('.cart-panel')
	const cartOverlay = document.querySelector('.cart-overlay')
	const cartClose = document.querySelector('.cart-close')
	const cartItemsContainer = document.querySelector('.cart-items')
	const addToCartButtons = document.querySelectorAll('.to-cart')
	const totalPriceElement = document.querySelector('.total-price') // Поле для итоговой цены

	let totalPrice = 0 // Переменная для хранения итоговой суммы

	const openCart = () => {
		cartPanel.classList.add('active')
		cartOverlay.classList.add('active')
		cartPanel.classList.remove('hidden')
		cartOverlay.classList.remove('hidden')
	}

	const closeCart = () => {
		cartPanel.classList.remove('active')
		cartOverlay.classList.remove('active')
		setTimeout(() => {
			cartPanel.classList.add('hidden')
			cartOverlay.classList.add('hidden')
		}, 300)
	}

	const addToCart = card => {
		const imgSrc = card.querySelector('img').src
		const title = card.querySelector('h2').textContent
		const priceElement = card.querySelector('.card-price p')
		const discountElement = priceElement.querySelector('span') // Скидка (если есть)

		const priceText = priceElement.textContent
			.replace(discountElement ? discountElement.textContent : '', '') // Убираем скидку из текста
			.trim()

		// Извлекаем цену товара
		const price = parseFloat(priceText.replace(/[^\d\.]/g, '')) // Преобразуем строку в число
		const discount = discountElement ? discountElement.textContent : '' // Если есть скидка

		if (!isNaN(price)) {
			totalPrice += price // Прибавляем цену товара к общей сумме
			updateTotalPrice() // Обновляем итоговую цену
		}

		// Создание элемента для корзины
		const cartItem = document.createElement('div')
		cartItem.classList.add('cart-item')

		cartItem.innerHTML = `
            <img src="${imgSrc}" alt="${title}">
            <div class="cart-item-content">
                <p class="cart-item-title">${title}</p>
                <p class="cart-item-price">
                    ${
											discount
												? `<span class="discount">${discount}</span>`
												: ''
										} ${priceText}
                </p> <!-- Скидка отображается отдельно -->
            </div>
            <button class="cart-item-remove">&times;</button>
        `

		// Сохраняем цену товара и скидку для дальнейшего использования
		const itemData = {
			price: price,
			discount: discount,
		}

		// Удаление товара из корзины
		cartItem
			.querySelector('.cart-item-remove')
			.addEventListener('click', () => {
				// Вычитаем только цену товара, игнорируем скидку
				if (!isNaN(itemData.price)) {
					totalPrice = Math.max(0, totalPrice - itemData.price) // Защищаем от отрицательных значений
					updateTotalPrice() // Обновляем итоговую цену
				}
				cartItem.remove()
			})

		cartItemsContainer.appendChild(cartItem)
	}

	// Функция для пересчёта итоговой цены
	const updateTotalPrice = () => {
		totalPriceElement.textContent = totalPrice.toFixed(2) // Обновляем итоговую сумму
	}

	// Открытие корзины при клике на значок
	document.querySelector('.logo-cart').addEventListener('click', openCart)

	// Закрытие корзины при клике на крестик
	cartClose.addEventListener('click', closeCart)

	// Закрытие корзины при клике за её пределами
	cartOverlay.addEventListener('click', closeCart)

	// Добавление товаров в корзину
	addToCartButtons.forEach(button => {
		button.addEventListener('click', event => {
			const card = event.target.closest('.card')
			addToCart(card)
			openCart()
		})
	})
})
