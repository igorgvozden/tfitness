import View from './view.mjs';
import { API_URL } from '../frontConfig.js';

class CollectionView extends View {


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
                                        data-add-to-cart="${[name, price, discount, colors[0], sizes[1]]}"
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

export default new CollectionView();