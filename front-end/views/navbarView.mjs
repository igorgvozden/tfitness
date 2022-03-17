import View from './view.mjs';
import { API_URL } from '../frontConfig.js';
import cart from './cart.mjs';

class NavbarView extends View {
    _data;
    _parentElement = document.querySelector('.header-container');
    _nav = document.querySelector('.header-container_nav');
    _subnavView = document.querySelector('.header-container_sub-nav');

    addHandlerInitialize(handler) {
        this.initialize();
        this._addProductButtonsMouseover();
        this._addSubnavMouseLeave();
        handler();
    };

    // NAV ICONS 

    addCartIconHandler(handler) {
        this._parentElement.addEventListener('click', (e) => {
            const cartIcon = e.target.closest('.nav__btn--cart');
            if (!cartIcon) return;
            handler();
        });
    };

    // ako je korisnik ulogovan menja se korisnik ikonica
    renderUserIcon(param) {
        const userBtn = document.querySelector('.nav__icon--profile');
        if (param === 'in') userBtn.src = `${API_URL}/person.svg`;
        if (param === 'out') userBtn.src = `${API_URL}/person-outline.svg`;
    };

    // 1) proveri da li postoji model.stateUser i da li je admin
    renderAdminIcon(param, address) {
        const adminBtn = document.querySelector('.nav__btn--admin');
        console.log(adminBtn, address);
        if (param === true) {
            adminBtn.classList.remove('hidden');

        }
        if (param === false) {
            adminBtn.classList.add('hidden');

        };
    };

    // handler za login ikonicu koji ce controller da poveze sa loginView
    addHandlerloginIconClick(handler) {
        this._parentElement.addEventListener('click', (e) => {
            const iconBtn = e.target.closest('.nav__btn--profile');
            if (!iconBtn) return;
            this.removeNavFixedPosition();
            handler();
        });
    };

    removeNavFixedPosition() {
        this._parentElement.classList.toggle('blured');
        // this._nav.classList.toggle('blured');
        this._nav.classList.toggle('fixed');
    }

    // SUBNAV 
    _renderSubnavData(selectedItems) {
        const productsDisplay = document.querySelector('.sub-nav__products__ul');

        const markup = `
            ${this._generateItems(selectedItems)}
        `;

        productsDisplay.innerHTML = '';
        productsDisplay.insertAdjacentHTML('afterbegin', markup);

        this._subnavDataMouseOver();
    };

    _generateItems(selectedItems) {
        const itemTemplate = `<li data-collection="%ITEMNAME%" class="sub-nav__products__ul__li">%ITEMNAME%</li>`;

        const items = this._data.leggings.map(el => {
            if (el.active && el.item === selectedItems) return itemTemplate.replace(/%ITEMNAME%/g, el.name);
        }).join('');

        return items;
    };

    _subnavDataMouseOver() {
        this._parentElement.addEventListener('mouseover', (e) => {
            const product = e.target.closest('.sub-nav__products__ul__li');
            if (!product) {
                this._subnavRemoveImage();
                return;
            };

            // ovde treba loadovati sliku u odnosu na data collection
            const imageName = product.dataset['collection'];
            this._subnavLoadImages(imageName);
            e.stopImmediatePropagation(); // ovo ce mozda praviti problem kasnije, obrati paznju...ovde samo stopiram bubbling da ne bi za svaki element nastavljao
        });
    };

    _subnavLoadImages(whichImage) {
        const imageDisplay = document.querySelector('.sub-nav__products-images');
        imageDisplay.style.backgroundImage = `url(${API_URL}/${whichImage.replace(' ', '-')}.png)`;
    };

    _subnavRemoveImage() {
        const imageDisplay = document.querySelector('.sub-nav__products-images');
        imageDisplay.style.backgroundImage = 'none';
    };

    _subnavShow() {
        this._subnavView.style.transform = 'translateY(0vh)';
    };

    _subnavHide() {
        this._subnavView.style.transform = 'translateY(-100vh)';
        this._subnavRemoveImage();
    };

    _removeActiveButton() {
        const allbtns = document.querySelectorAll('.nav-tabs__text--products');
        for (const btn of allbtns) {
            btn.classList.remove('underlined')
        };
    };

    _addProductButtonsMouseover() {
        this._parentElement.addEventListener('mouseover', (e) => {
            const btn = e.target.closest('.nav-tabs__text--products');
            if (!btn) return;

            this._removeActiveButton();
            btn.classList.add('underlined');

            const selectedItemToShow = btn.dataset['chooseProduct'];
            this._renderSubnavData(selectedItemToShow);

            this._subnavShow();
        });
    };

    _addSubnavMouseLeave() {
        this._parentElement.addEventListener('mouseleave', () => {
            this._subnavHide();
            this._removeActiveButton()
        });
    };
};

export default new NavbarView();