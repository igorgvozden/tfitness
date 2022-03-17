import View from './view.mjs';
import { API_URL } from '../frontConfig.js';

class HeroView extends View {
    _data;
    _parentElement = document.querySelector('.hero');
    _carouselContainer = document.querySelector('.collection__carousel');

    //  ADD HANDLER FUNKCIJE
    addHandlerRender(data) {
        this.initialize(data);
        // renderuj hero markup
        this.renderHero();
        // aktiviraj buttone
        this._switchWindows();
        this._addToCart();
        this._changeShopPhotos();
    };

    blurParentElement() {
        this._parentElement.classList.toggle('blured');
    };

    // HERO CAROUSEL
    _switchWindows() {
        this._parentElement.addEventListener('click', (e) => {
            const switchBtn = e.target.closest('.collection__carousel__switch');
            if (!switchBtn) return;

            const carousel = e.target.closest('.collection__carousel'); // ovde sam definisao .closest da bubbling ne bi aktivirao poslednji element

            switchBtn.classList.toggle('collection__carousel__switch--rotate');
            carousel.classList.toggle('collection__carousel--slide');
        });
    };

    // SHOP

    _changeShopPhotos() {
        this._parentElement.addEventListener('click', (e) => {
            const colorSelectionBtn = e.target.closest('.shop__selection__colors-color');
            if (!colorSelectionBtn) return;

            const shopPhotoDisplay = e.target.closest('.collection__carousel__shop'); // pronasao sam html element u kom se nalazi childNode koji hocu da menjam

            // pronadji child node koji ti treba: .shop__carousel-container
            const shopPhotoDisplayChildren = shopPhotoDisplay.children;
            for (const el of shopPhotoDisplayChildren) {

                if (el.classList.contains('shop__container')) {
                    const shopContainerChildren = el.children[0];

                    const definiteChild = shopContainerChildren.children[0]; // ovaj element mi treba
                    const shopCarouselContainer = definiteChild.children;

                    // iterate kroz childse i promeni im src - imaces name, color i index na data-setu sa colorSelectionBtn
                    for (let i = 0; i < shopCarouselContainer.length; i++) {
                        shopCarouselContainer[i].style.backgroundImage = this._changeBackgroundImageUrl(colorSelectionBtn.dataset['color'], colorSelectionBtn.dataset['name']);
                    };
                };
            };
        });
    };

    // ovo je objekat koji ce se proslediti local storage-u za shopping cart
    _cartItem = {
        name: '',
        size: 'm',
        color: '',
        price: '',
        discount: ''
    };

    _createLocalStorageCart(item) {
        const newLocalStorage = [];

        // 1) proveri da li postoji local storage cart
        const currentLocalStorage = localStorage.getItem('cart');

        // 2) ako postoji, parsuj ga i pushuj u newLocalStorage
        if (currentLocalStorage) {
            const parsedLocalStorage = JSON.parse(currentLocalStorage);
            newLocalStorage.push(...parsedLocalStorage);
        } else console.log('nema nicega u localStorage');

        // 3) pushuj item koji korisnik zeli da doda u cart
        newLocalStorage.push(item);

        // 4) sacuvaj newLocalStorage u localStorage
        localStorage.setItem('cart', JSON.stringify(newLocalStorage));
        console.log(JSON.parse(localStorage.getItem('cart')), 'ovo je parsovan lc');
    };

    _addToCart() {
        // ovde cu skupiti podatke o artiklu koji korisnik hoce da doda u cart
        // svi podaci su u data-setu html elemenata u shopu (pogledaj this._generateMarkup)

        this._parentElement.addEventListener('click', (e) => {
            const addToCartBtn = e.target.closest('.shop-text--button');
            if (!addToCartBtn) return;

            const item = addToCartBtn.dataset['addToCart'].split(',');

            this._cartItem.name = item[0];
            this._cartItem.price = item[1];
            this._cartItem.discount = item[2];
            this._cartItem.color = item[3];

            this._createLocalStorageCart(this._cartItem);
        });
        // SIZE
        this._parentElement.addEventListener('click', (e) => {
            const allBtns = e.target.closest('.shop__selection__sizes-buttons');
            const sizeBtn = e.target.closest('.shop__selection__sizes-size');
            if (!sizeBtn) return;

            this._cartItem.size = sizeBtn.dataset['size'];

            const buttons = allBtns.children; // imam div element a potrebni su mi njegovi childrenNodes
            for (const btn of buttons) {
                if (btn.classList.contains('shop__size-button--active')) btn.classList.remove('shop__size-button--active');
            }
            sizeBtn.classList.add('shop__size-button--active');
        });
        // COLOR
        this._parentElement.addEventListener('click', (e) => {
            const allBtns = e.target.closest('.shop__selection__colors');
            const colorBtn = e.target.closest('.shop__selection__colors-color');
            if (!colorBtn) return;

            this._cartItem.color = colorBtn.dataset['color'];

            const buttons = allBtns.children; // imam div element a potrebni su mi njegovi childrenNodes
            for (const btn of buttons) {
                if (btn.classList.contains('shop__color-button--active')) btn.classList.remove('shop__color-button--active');
            }
            colorBtn.classList.add('shop__color-button--active');
        });
    };

    renderHero() {
        // 1) u odnosu na this._data renderovace broj kolekcija
        const heroMarkup = this._data.map(collection => {
            const { name, price, colors, sizes, discount, active, description } = collection;

            // if (!active) return ''; // obrati paznju da li prekida ceo map

            return this._generateMarkup(name, price, colors, sizes, discount, description);
        });

        // 2) renderuj kolekciju za svaki this._data legging
        heroMarkup.forEach((markup, i) => {
            this._parentElement.insertAdjacentHTML('afterbegin', markup);
        });
    };

    _generateMarkup(name, price, colors, sizes, discount, description) {
        return `
        <div class="collection">
                <div class="collection__carousel">
                    <div class="collection__carousel__photo collection__carousel__window">
                        <p class="uppercase headings-font">${name}</p>
                        <p>${description}</p><span class="shop-text--discount">${discount !== 0 ? discount : ''}</span>
                    </div>

                    <div class="collection__carousel__switch">
                        <img src="./images/chevron-forward-outline.svg" />
                    </div>

                    <div class="collection__carousel__shop collection__carousel__window">

                        <div class="shop__description shop-window">
                            <p class="shop-text">${name}</p>
                            <p class="shop-text">${description}</p>
                            <p class="shop-text">${price}.00 rsd</p><span class="shop-text--discount">${discount !== 0 ? discount : ''}</span>
                        </div>

                        <div class="shop__container shop-window">

                            <div class="shop__carousel">

                                <div class="shop__carousel-container">
                                    <div class="shop__carousel-container__image"
                                    style="background-image: url('${API_URL}/shop-images/${name.includes(' ') ? name.replace(' ', '-') : name}-${colors[0]}(500x400).jpg')">
                                    </div>
                                    <div class="shop__carousel-container__image"
                                    style="background-image: url('${API_URL}/shop-images/${name.includes(' ') ? name.replace(' ', '-') : name}-${colors[0]}(500x400).jpg')">
                                    </div>
                                    <div class="shop__carousel-container__image"
                                    style="background-image: url('${API_URL}/shop-images/${name.includes(' ') ? name.replace(' ', '-') : name}-${colors[0]}(500x400).jpg')">
                                    </div>
                                    <div class="shop__carousel-container__image"
                                    style="background-image: url('${API_URL}/shop-images/${name.includes(' ') ? name.replace(' ', '-') : name}-${colors[0]}(500x400).jpg')">
                                    </div>
                                </div>
                                
                            </div>

                        </div>

                        <div class="shop__selection shop-window">
                            <div class="shop__selection__sizes">
                                <p class="shop-text">boje u ponudi</p>
                                <div class="shop__selection__colors">

                                    ${this._renderColors(colors, name)}

                                </div>
                                <div class="shop__selection__sizes-container">
                                    <p class="shop-text shop-text--inline">Izaberi veličinu</p>
                                    <p class="shop-text shop-text--inline ">Vodič za veličine</p>

                                    <div class="shop__selection__sizes-buttons">
                                        ${this._renderSizeButtons(sizes)}
                                    </div>

                                    <p class="shop-text shop-text--button uppercase headings-font"
                                        data-add-to-cart="${[name, price, discount, colors[0]]}"
                                    >Ubaci u korpu</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    };

    _changeBackgroundImageUrl(color, name, index = '') {
        return `
        
            url('${API_URL}/shop-images/${name.includes(' ') ? name.replace(' ', '-') : name}-${color}${index}(500x400).jpg')
        
        `;
        // `url('${API_URL}/shop-images/lifters-crna(500x400).jpg')`
    };

    _renderColors(colorsArray, name) {
        const markup = colorsArray.map((color, i) => {
            if (i === 0) {
                return `
                <div class="shop__selection__colors-color shop__color-button--active" data-color="${color}" data-name="${name}"
                style="background-image: url('${API_URL}/shop-images/${name.includes(' ') ? name.replace(' ', '-') : name}-${color}(125x100).jpg')">
                    ${color}
                    </div>
                `;
            } else {
                return `
                <div class="shop__selection__colors-color" data-color="${color}" data-name="${name}"
                style="background-image: url('${API_URL}/shop-images/${name.includes(' ') ? name.replace(' ', '-') : name}-${color}(125x100).jpg')">
                    ${color}
                    
                </div>
                `;
            }
        }).join('');
        return markup;
    };

    _renderSizeButtons(sizesArray) {
        const markup = sizesArray.map((size, i) => {
            if (i === 1) {
                return `
                <div class="shop__selection__sizes-size uppercase shop__size-button--active" data-size="${size}">${size}</div>
                `;
            } else {
                return `
                <div class="shop__selection__sizes-size uppercase" data-size="${size}">${size}</div>
                `;
            }
        }).join('');
        return markup;
    };

};

export default new HeroView();