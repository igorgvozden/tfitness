import icons from '../../images/icons.svg';

export default class View {
    _data;
    // trebace mi parent element za svaki view
    // error message za svaki view
    // generateMarkup() za svaki view

    render(data) {
        if (!data) return this._renderError();

        this._data = data;
        const markup = this._generateMarkup();
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    };

    renderSpinner() {
        const markup =
            `<div class="spinner">
                <svg>
                <use href="${icons}.svg#icon-loader"></use>
                </svg>
            </div>`;

        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    };

    _clear() {
        this._parentElement.innerHTML = '';
    };

    _renderError(message = this._errorMessage) {
        const markup = `
      <div class="error">
        <div>
            <svg>
                <use href="${icons}#icon-alert-triangle"></use>
            </svg>
        </div>
      <p>${message}</p>
      </div>`;

        this._clear();
        this._parentElement.insertAdjacentHTML('beforebegin', markup);
    };
};