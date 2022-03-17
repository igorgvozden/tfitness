export default class View {
    _data;
    // trebace mi parent element za svaki view
    // error message za svaki view
    // initialize za svaki view

    initialize(data) {
        // if (!data) return this._renderError();

        this._data = data;
    };

    renderSpinner(element, template) {
        const markup =
            `<div class="spinner uppercase ">
                ...spin
            </div>`;

        element.innerHTML = '';
        template ? element.insertAdjacentHTML('afterbegin', template) : element.insertAdjacentHTML('afterbegin', markup);
        // element.insertAdjacentHTML('afterbegin', markup);
    };

    _clear() {
        this._parentElement.innerHTML = '';
    };

    _renderError(message = this._errorMessage) {
        const markup = `
      <div class="error">
        <div>
            <p>${message}</p>    
        </div>
      </div>`;

        this._clear();
        this._parentElement.insertAdjacentHTML('beforebegin', markup);
    };
};