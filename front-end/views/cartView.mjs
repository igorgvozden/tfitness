import View from './view.mjs';
import { API_URL } from '../frontConfig.js';

class CartView extends View {
    _parentElement = document.querySelector('.modal');
    _cartContainer = document.querySelector('.cart-container');

    toggleShowCart() {
        this._parentElement.classList.remove('hidden');

        const documentContainer = document.querySelector('.container');
        documentContainer.classList.add('blured');

        this._parentElement.addEventListener('click', (e) => {
            const closeBtn = e.target.closest('.cart__close-btn');
            const backToShoppingBtn = e.target.closest('.cart-container__button--empty');
            const cart = e.target.closest('.cart');

            if (!closeBtn && !backToShoppingBtn) return;

            this._parentElement.classList.add('hidden');
            documentContainer.classList.remove('blured');
        });

        this.updateCart();
        this._buy();
        console.log(this)
    };

    addRemoveCartItemHandler(handler) {
        this._cartContainer.addEventListener('click', (e) => {
            const removeBtn = e.target.closest('.cart-btn--remove');
            if (!removeBtn) return;

            const cartItem = e.target.closest('.cart__item');
            cartItem.style.display = 'none';
            console.log(this._data.cart);

            const itemData = cartItem.dataset['item'];
            const itemToRemove = itemData.replace(/,/g, '');

            handler(itemToRemove);
        });
    };

    addIncreaseQuantityHandler(handler) {
        this._cartContainer.addEventListener('click', (e) => {
            const plusBtn = e.target.closest('.cart-btn--plus');
            const cartItem = e.target.closest('.cart__item');
            if (!plusBtn) return;

            const cartItemData = cartItem.dataset['item'];
            const itemToAdd = cartItemData.replace(/,/g, '');

            handler(itemToAdd);
        });
    };

    addDecreaseQuantityHandler(handler) {
        this._cartContainer.addEventListener('click', (e) => {
            const minusBtn = e.target.closest('.cart-btn--minus');
            const cartItem = e.target.closest('.cart__item');
            if (!minusBtn) return;

            const itemQuantity = cartItem.dataset['quantity'];
            const cartItemData = cartItem.dataset['item'];
            const itemToDecrease = cartItemData.replace(/,/g, '');

            handler(itemToDecrease, itemQuantity);
        });
    };

    updateCart() {
        (this._data.cart.length < 1) ? this._generateEmptyCart() : this._generateFullCart();
    };

    _buy() {
        this._parentElement.addEventListener('click', (e) => {
            e.preventDefault();
            const buyBtn = e.target.closest('.cart-form__submit-button');
            if (!buyBtn) return;
            const cartForm = document.querySelector('.cart-form');

            // info o artiklima i kupcu imas u this._data
            console.log(this._data, cartForm);

            /////////////////////////////////////

            // 1) pokupi podatke iz forme
            const dataArray = [...new FormData(cartForm)];
            const formData = Object.fromEntries(dataArray);

            // 2) ako je korisnik ulogovan, uporedi podatke iz forme sa this._date.user
            if (this._data.user.user) {
                const currentUser = this._data.user.user;

                // proveri da li korisnik menjao svoje podatke u formi
                Object.entries(formData).forEach(el => {
                    if (el[1] !== currentUser[el[0]]) currentUser[el[0]] = el[1];
                });
            } else {
                // ako korisnik nije ulogovan, prosledi podatke iz forme
                this._data.user.user = formData;
            }

            // URADI PROVERU INPUTA NA FORMI

            ////////////////
            // prosledi na mail
            console.log(this._data, 'ovo treba proslediti na mail')
        });

    };

    _generateFullCart() {
        const markup = `
                <div class="cart-container__info">
                <div class="cart-container__info__items">

                    ${this._generateCartItems()}

                </div>
                <div class="cart-container__info__buyer">
                    
                    ${!this._data.user.user ? this._generateGuest() : this._generateLoggedInUser(this._data.user)}

                </div>
            </div>

            <div class="cart-container__sumary">
                <div class="cart-container__summary__checkout">
                    <p class="checkout__total-price">Ukupan iznos:</p>
                    <p class="checkout__total-price checkout__total-price--amount headings-font">${this._formatPrice(this._calculateTotalPrice())},00 rsd</p>
                </div>
                <button class="cart-form__submit-button uppercase headings-font submit-button"
                    type="button" form="cart-form">poruči</button>
            </div>
        `;
        this._cartContainer.innerHTML = '';
        this._cartContainer.insertAdjacentHTML('afterbegin', markup);
    };

    _generateGuest() {
        return `
            <form class="cart-form" id="cart-form>
                <p class="cart-form__title headings-font">Tvoji podaci</p>
                <label class="cart-form__label form-label">Ime:
                    <input class="cart-form__input form-input" type="text" name="name" placeholder="npr. Jana Jovanovic"
                        data-placeholder="npr. Jana Jovanovic" />
                </label>
                <label class="cart-form__label form-label">Mesto:
                    <input class="cart-form__input form-input" type="text" name="city" placeholder="npr. 21000 Novi Sad"
                        data-placeholder="npr. 21000 Novi Sad" />
                </label>
                <label class="cart-form__label form-label">Adresa:
                    <input class="cart-form__input form-input" type="text" name="address" placeholder="npr. Bulevar Oslobođenja 21/3"
                        data-placeholder="npr. Bulevar Oslobođenja 21/3" />
                </label>
                <label class="cart-form__label form-label">Telefon:
                    <input class="cart-form__input form-input" type="text" name="telephone" placeholder="npr. 060 123 4 567"
                        data-placeholder="npr. 060 123 4 567" />
                </label>
                <p class="cart-form__link form-links">imaš nalog?
                    <span class="form-links--highlighted cart-form__switch-btn">Uloguj se!</span>
                </p>
            </form>
        `;
    };

    _generateLoggedInUser(user) {
        return `
            <form class="cart-form" id="cart-form">
                
            <div class="cart-panel__user-avatar">
                <div class="cart-panel__user-avatar__picture">
                    <p class="cart-panel__user-avatar__name-initials">${user.user.name[0]}</p>
                </div>
                <p class="cart-panel__user-avatar__name headings-font">${user.user.name}</p>
            </div>

            <p class="cart-form__link form-links">Želiš isporuku na ovoj adresi?</p>
                <label class="cart-form__label form-label">Mesto:
                    <input class="cart-form__input form-input" type="text" name="city" placeholder="npr. 21000 Novi Sad"
                    value="${user.user.city}"
                        data-placeholder="npr. 21000 Novi Sad" />
                </label>
                <label class="cart-form__label form-label">Adresa:
                    <input class="cart-form__input form-input" type="text" name="address" placeholder="npr. Bulevar Oslobođenja 21/3"
                    value="${user.user.address}"
                        data-placeholder="npr. Bulevar Oslobođenja 21/3" />
                </label>
                <label class="cart-form__label form-label">Telefon:
                    <input class="cart-form__input form-input" type="text" name="telephone" placeholder="npr. 060 123 4 567"
                    value="${user.user.telephone}"
                        data-placeholder="npr. 060 123 4 567" />
                </label>
            </form>
        `;
    };

    _generateCartItems() {
        const cartItems = this._data.cart;
        const markup = cartItems.map(item => {
            const { name, color, size, price, discount, quantity } = item;
            return this._generateCartItemsMarkup(name, color, size, price, discount, quantity);
        });
        return markup.join('');
    };

    _formatPrice(price, discount = 0, quantity = 1) {
        const finalPrice = ((Number(price) - Number(discount)) * quantity).toString();
        const a = [...finalPrice];
        a.splice(-3, 0, '.').join('');
        return a.join('');
    };

    _calculateTotalPrice() {
        const prices = this._data.cart.map(item => item.quantity * (Number(item.price) - Number(item.discount)));
        const total = prices.reduce((a, b) => a + b);
        return total;
    };

    _generateCartItemsMarkup(name, color, size, price, discount, quantity) {
        return `
            <div class="cart__item" data-item="${[name, color, size]}" data-quantity="${quantity}">
                <div class="cart__item__desc">
                    <div class="cart__item__text">
                        <p
                            class="cart__item__text-line cart__item__text-line--name uppercase headings-font">
                            ${name}
                        </p>
                        <p class="cart__item__text-line cart__item__text-line--color">${color}</p>
                        <p class="cart__item__text-line cart__item__text-line--size uppercase">${size}</p>
                        <p class="cart__item__text-line cart__item__text-line--amount ">
                            ${this._formatPrice(price, discount)},00 rsd
                        </p>
                    </div>
                    <div class="cart__item__photo"
                    style="background-image: url('${API_URL}/shop-images/${name.includes(' ') ? name.replace(' ', '-') : name}-${color}(125x100).jpg')">

                    </div>
                </div>

                <div class="cart__item__bar">
                    <p class="cart__item__bar-text cart__item__bar-text--btn cart-btn--remove">
                        <img src="./images/trash.svg" alt="kanta" />
                    </p>
                    <p class="cart__item__bar-text cart__item__bar-text--btn cart-btn--minus">-</p>
                    <p class="cart__item__bar-text cart__item__bar-text--quantity">${quantity}</p>
                    <p class="cart__item__bar-text cart__item__bar-text--btn cart-btn--plus">+</p>
                    <p class="cart__item__bar-text cart__item__bar-text--amount headings-font">${this._formatPrice(price, discount, quantity)},00 rsd</p>
                </div>
            </div>
        `;
    };

    _generateEmptyCart() {
        const markup = `
            <img class="cart-container__bag-image--empty" src="./images/bag-handle.svg" />
            <p>tvoja torba je prazna ...</p>
            <p class="cart-container__button--empty submit-button">Nastavi sa shoppingom!</p>
        `;
        this._cartContainer.innerHTML = '';
        this._cartContainer.insertAdjacentHTML('afterbegin', markup);
    };

};

export default new CartView();