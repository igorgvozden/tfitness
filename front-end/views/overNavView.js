import View from "./view";

class OverNavView extends View {
    _parentElement = document.querySelector('over-nav-info');
    _errorMessage = 'Sajt trenutno nije u funkciji!';
    _message = 'Koristimo kolacice';

    _generateMarkup() {
        return `
        <p>${this._message}</p>
        `;
    };

    scrollText() {

    };
};

export default new OverNavView();