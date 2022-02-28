import View from './view.mjs';

class NavbarView extends View {
    _data;
    _parentElement = document.querySelector('.header-container');
    _subnavView = document.querySelector('.header-container_sub-nav');

    addHandlerInitialize(handler) {
        this.initialize();
        this._addProductButtonsMouseover();
        this._addSubnavMouseLeave();
        handler();
    };


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
            console.log(product.dataset['collection']);
        });
    };

    _subnavLoadImages(whichImage) {
        const imageDisplay = document.querySelector('.sub-nav__products-images');
        imageDisplay.style.backgroundImage = `url(http://localhost:3000/${whichImage.replace(' ', '-')}.png)`;
    };

    _subnavRemoveImage() {
        const imageDisplay = document.querySelector('.sub-nav__products-images');
        imageDisplay.style.backgroundImage = 'none';
    };

    _subnavShow() {
        this._subnavView.style.transform = 'translateY(0%)';
    };

    _subnavHide() {
        this._subnavView.style.transform = 'translateY(-100%)';
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