import { Collection } from 'mongoose';
import View from './view';

class SubNavView extends View {
    _data;
    _parentElement = document.querySelector('.header-container_sub-nav'); // ovde ce se loadovati artikli sa db i slike
    _errorMessage = 'Oooops! Doslo je do problema na serveru...';

    addHandlerRender(handler) {
        this.renderSpinner();
        handler();
    };

    _generateMarkup() {
        return `
        <div class="sub-nav__products-list">
            <p class="headings-font uppercase nav-tab-text">kolekcije</p>
            <ul class="sub-nav__products__ul">
                ${this.generateItems()}
            </ul>
        </div>
        <div class="sub-nav__products-images">
            
        </div>`;
    };

    generateItems() {
        const itemTemplate = `<li data-collection="%ITEMNAME%" class="sub-nav__products__ul__li">%ITEMNAME%</li>`;

        const items = this._data.leggings.map(el => {
            if (el.active) return itemTemplate.replace(/%ITEMNAME%/g, el.name);
        }).join('');

        return items;
    };

    addMouseOver() {
        this._parentElement.addEventListener('mouseover', function (e) {
            const listElement = e.target.closest('.sub-nav__products__ul__li');
            if (!listElement) return;

            const imageDisplay = document.querySelector('.sub-nav__products-images');
            imageDisplay.innerHTML = '';
            imageDisplay.insertAdjacentHTML('afterbegin', `<img src="http://localhost:3000/${listElement.dataset['collection']}.png" />`)
        });
    };

    addMouseOut() {
        this._parentElement.addEventListener('mouseout', function (e) {
            const listElement = e.target.closest('.sub-nav__products__ul__li');
            if (!listElement) return;

            const imageDisplay = document.querySelector('.sub-nav__products-images');
            imageDisplay.innerHTML = '';
        });
    };
};

export default new SubNavView();