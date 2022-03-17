import View from './view.mjs';
import { API_URL } from '../frontConfig.js';

class Cart extends View {
    _parentElement = document.querySelector('.modal');
    _cartContainer = document.querySelector('.cart-container');

    toggleShowCart() {
        this._parentElement.classList.toggle('hidden');

        this._hideCart();

        // 1) proveri postoji li cart u localStorage - ako nema renderuj empty cart
        const isLocalStorage = localStorage.getItem('cart');
        if (!isLocalStorage) this._generateEmptyCart();

        // 2) ako postoji localStorage za cart - renderuj cart
        if (isLocalStorage) this._generateFullCart();

    };

    _hideCart() {
        const documentContainer = document.querySelector('.container');
        documentContainer.classList.toggle('blured');

        this._parentElement.addEventListener('click', (e) => {
            const closeBtn = e.target.closest('.cart__close-btn');
            const cart = e.target.closest('.cart');
            if (cart && !closeBtn) return;
            this.toggleShowCart();
        });
    };

    _parseLocalStorage() {
        const currentStorage = JSON.parse(localStorage.getItem('cart'));
        console.log(currentStorage);
        return currentStorage;
    };

    _generateFullCart() {

        const markup = `
                <div class="cart-container__info">
                <div class="cart-container__info__items">

                    ${this._generateCartItems()}

                </div>
                <div class="cart-container__info__buyer">
                    <form class="cart-form">
                        <p class="cart-form__title headings-font">Tvoji podaci</p>
                        <label class="cart-form__label form-label">Ime:
                            <input class="cart-form__input form-input" type="text" name="name" placeholder=""
                                data-placeholder="npr. Jana Jovanovic" />
                        </label>
                        <label class="cart-form__label form-label">Mesto:
                            <input class="cart-form__input form-input" type="text" name="city" placeholder=""
                                data-placeholder="npr. 21000 Novi Sad" />
                        </label>
                        <label class="cart-form__label form-label">Adresa:
                            <input class="cart-form__input form-input" type="text" name="address" placeholder=""
                                data-placeholder="npr. Bulevar Oslobođenja 21/3" />
                        </label>
                        <label class="cart-form__label form-label">Telefon:
                            <input class="cart-form__input form-input" type="text" name="telephone" placeholder=""
                                data-placeholder="npr. 060 123 4 567" />
                        </label>
                        <p class="cart-form__link form-links">imaš nalog?
                            <span class="form-links--highlighted cart-form__switch-btn">Uloguj se!</span>
                        </p>
                    </form>
                </div>
            </div>

            <div class="cart-container__sumary">
                <div class="cart-container__summary__checkout">
                    <p class="checkout__total-price">Ukupan iznos:</p>
                    <p class="checkout__total-price">0.00 rsd</p>
                </div>
                <button class="cart-form__submit-button uppercase headings-font submit-button"
                    type="button">poruči</button>
            </div>
        `;
        this._cartContainer.innerHTML = '';
        this._cartContainer.insertAdjacentHTML('afterbegin', markup);
    };

    _generateCartItems() {
        const storageItems = this._parseLocalStorage();

        const markup = storageItems.map(item => {
            const { name, color, size, price, discount } = item;

            return this._generateCartItemsMarkup(name, color, size, price);
        });
        return markup.join('');
    };

    _generateCartItemsMarkup(name, color, size, price, discount) {
        return `
            <div class="cart__item">
                <div class="cart__item__desc">
                    <div class="cart__item__text">
                        <p
                            class="cart__item__text-line cart__item__text-line--name uppercase headings-font">
                            ${name}
                        </p>
                        <p class="cart__item__text-line cart__item__text-line--color">${color}</p>
                        <p class="cart__item__text-line cart__item__text-line--size uppercase">${size}</p>
                        <p class="cart__item__text-line cart__item__text-line--amount headings-font">
                            ${price}.00 rsd
                        </p>
                    </div>
                    <div class="cart__item__photo"
                    style="background-image: url('${API_URL}/shop-images/${name.includes(' ') ? name.replace(' ', '-') : name}-${color}(125x100).jpg')">

                    </div>
                </div>

                <div class="cart__item__bar">
                    <p class="cart__item__bar-text cart__item__bar-text--btn">
                        <img src="./images/trash.svg" alt="kanta" />
                    </p>
                    <p class="cart__item__bar-text cart__item__bar-text--btn cart-btn--minus">-</p>
                    <p class="cart__item__bar-text cart__item__bar-text--quantity">1</p>
                    <p class="cart__item__bar-text cart__item__bar-text--btn cart-btn--plus">+</p>
                    <p class="cart__item__bar-text cart__item__bar-text--amount">0.00 rsd</p>
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

export default new Cart();