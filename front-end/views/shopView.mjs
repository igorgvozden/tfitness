import View from "./view.mjs";

class ShopView extends View {
    _data;
    _parentElement = document.querySelector('.hero');
    _carouselContainer = document.querySelector('.collection__carousel');

    addHandlerRender(data) {
        this.initialize(data);
        // renderuj hero markup
        this.renderHero();
        // aktiviraj buttone
        this._switchWindows();
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

    addCollections(handler, data) {
        handler(data);
    };

};

export default new ShopView();