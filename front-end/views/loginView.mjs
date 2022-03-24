import { API_URL } from '../frontConfig.js';
import View from './view.mjs';

class LoginView extends View {
    _data;
    _parentElement = document.querySelector('.login-container');

    // handler funkcija koja ce biti pozvana iz controller/navbarView kako bi se prikazao login/register
    async addHandlerRender(handler) {
        // 1) handler ce proveriti da li u modelu postoji ulogovan korisnik
        const userLogged = await handler();

        // 2) ako je korisnik ulogovan renderuj user panel
        if (userLogged) {
            this._renderComponent(this._generateUserPanel());
            this._populateUserPanelForm();
        };

        // 3) ako nije ulogovan, prikazi login formu
        if (!userLogged) this._renderComponent(this._generateLogin());

        // 4) ako je URL prosledjen sa forgotPassword ili resetPassword, URL ce imati hash
        if (window.location.hash) this._renderComponent(this._generateResetPassword());

        // 5) aktiviraj dugmice za switch login/register
        this._loginRegisterSwitch();
    };

    // handler za close button forme koji ce controller proslediti i navbaru da vrati fixed position navu
    addHandlerLoginFormCloseBtn(handler) {
        this._parentElement.addEventListener('click', (e) => {
            const closeBtn = e.target.closest('.login-container__close-btn');
            const form = e.target.closest('.login-form');
            if (form && !closeBtn) return;

            this.showLoginView();
            handler();
        });
    };

    // login/register 
    addLoginHandler(handler) {
        this._collectFormData(handler);
        this._eyePasswordIcon();
    };

    // log out korisnika
    addLogoutHandler(handler) {
        this._parentElement.addEventListener('click', (e) => {
            const logoutBtn = e.target.closest('.user-panel__btn--logout');
            if (!logoutBtn) return;
            handler();
        });
    };

    // update korisnickih informacija
    addUpdateUserHandler(handler) {
        this._collectFormData(handler);
    };

    // otvara i zatvara login/register/user panel 
    showLoginView() {
        this._parentElement.classList.toggle('hidden');
    };

    // event listener za login/register form view switch
    _loginRegisterSwitch() {
        this._parentElement.addEventListener('click', (e) => {
            const switchBtn = e.target.closest('.login-form__switch-btn');
            if (!switchBtn) return;

            const switchTo = switchBtn.dataset['switchTo'];

            if (switchTo === 'login') this._renderComponent(this._generateLogin());
            if (switchTo === 'register') this._renderComponent(this._generateRegister());

            this._collectFormData();
        });
    };

    _renderComponent(markup) {
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
        // this._collectFormData(); // collectFormData mora da ostane ovde da bi se pokrenula svaki put funkcija provere forme na switchu login/register
    };

    // menja PASSWORD input type(text/password) u formi 
    _eyePasswordIcon() {
        this._parentElement.addEventListener('click', (e) => {
            const eyeIcon = e.target.closest('.login-form__password__eye-icon');
            if (!eyeIcon) return;
            const passInput = eyeIcon.parentElement.previousElementSibling;

            if (passInput.type === 'password') {
                passInput.type = 'text';
                eyeIcon.src = `${API_URL}/eye-off.svg`;
            } else if (passInput.type === 'text') {
                passInput.type = 'password';
                eyeIcon.src = `${API_URL}/eye-on.svg`;
            };
        });
    };

    // prikupljanje podataka iz forme
    _collectFormData(handler) {
        // const userForm = document.querySelector('.login-form');
        const informationSpans = document.querySelectorAll('.login-form__label__span');

        this._parentElement.addEventListener('submit', (e) => {
            const form = e.target.closest('.login-form');
            e.preventDefault();
            const dataArray = [...new FormData(form)];
            const userData = Object.fromEntries(dataArray);
            userData.action = form.dataset['action'];

            // proveri da li URL ima hash u sebi // ako ima, URL je formiran za reset passworda
            if (window.location.hash) {
                // req.body na ruti za passwordReset  zahteva objekat {password i confirmPassword}, i trazi token za korisnika kao parametar /resetpassword/:token
                const resetToken = window.location.hash.split('=')[1];
                userData.resetToken = resetToken;
                //controller ce proslediti req.body objekat iz forme, na url sa tokenom
                // ako dobije dobar res, obrisace hash iz URL
                // ruta za resetPassword vraca korisnika za kog je menjan pass, pa pokupi mail i uloguj korisnika odmah
            };

            // proveri form inpute - da li su svi popunjeni

            for (const entrie of Object.entries(userData)) {
                for (const span of informationSpans) {
                    if (span.dataset['errSpan'] === entrie[0] && entrie[1].length < 1) span.innerHTML = 'Polje ne može biti prazno';
                    if (span.dataset['errSpan'] === entrie[0] && entrie[1].length > 1) span.innerHTML = '';
                };
            };
            if (!handler) return;
            handler(userData);
        });

        // proveri inpute nakon unosa da li je input ostao prazan
        this._parentElement.addEventListener('input', (e) => {
            const formInput = e.target.closest('.login-form__input');
            if (!formInput) return;

            for (const span of informationSpans) {
                if (span.dataset['errSpan'] === formInput.name && formInput.value.length < 1) span.innerHTML = 'Polje ne može biti prazno';
                if (span.dataset['errSpan'] === formInput.name && formInput.value.length >= 1) span.innerHTML = '';
            };
        });
    };

    _populateUserPanelForm() {
        const userPanelInputs = document.querySelectorAll('.user-panel-form__input');
        const avatarName = document.querySelector('.user-panel__user-avatar__name');
        const avatarInitials = document.querySelector('.user-panel__user-avatar__name-initials');

        for (const entrie of Object.entries(this._data.user)) {
            for (const panelInput of userPanelInputs) {
                if (entrie[0] === panelInput.name && entrie[1]) panelInput.value = entrie[1];
                if (panelInput.placeholder === 'undefined' || panelInput.placeholder === '') panelInput.placeholder = panelInput.dataset['placeholder'];
                if (entrie[0] === 'name' && entrie[1]) {
                    avatarName.innerHTML = entrie[1];
                    avatarInitials.innerHTML = entrie[1][0];
                };
            };
        };
    };

    _generateLogin() {
        return `
        <div class="login-container__mask">
        <form class="login-form" data-action="login">
        <p class="login-container__close-btn">&#10006;</p>
            <h4 class="uppercase headings-font login-form__element">uloguj se u svoj profil</h4>
            <label class="login-form__label login-form__element">Email adresa:
                <input class="login-form__input" type="text" name="email"
                    placeholder="Unesi svoju e-mail adresu" />
            </label>
            
            <span class="login-form__label__span" data-err-span="email"></span>


            <label class="login-form__label login-form__element">Lozinka:
                <input class="login-form__input login-form__input--password" type="password" name="password"
                    placeholder="Unesi svoju lozinku" />
                <span class="login-form__password__eye">
                    <img class="login-form__password__eye-icon" src="./images/eye-on.svg" />
                </span>
            </label>

            <span class="login-form__label__span" data-err-span="password"></span>


            <p class="login-form__element login-form__links login-form__links--highlighted">Ne secas se svoje
                lozinke?</p>
            <button class="login-form__submit-button uppercase headings-font login-form__element"
                type="submit">Uloguj
                se</button>
            <p class="login-form__element login-form__links">Nemas profil? <span
                    class="login-form__links--highlighted login-form__switch-btn" data-switch-to="register">Registruj se!</span></p>
        </form>
    </div>
        `;
    };

    _generateRegister() {
        return `
        <div class="login-container__mask">
                <form class="login-form" data-action="register">
                <p class="login-container__close-btn">&#10006;</p>
                    <h4 class="uppercase headings-font login-form__element">registruj se</h4>
                    <label class="login-form__label login-form__element">Napisi nam svoje ime:
                        <input class="login-form__input" type="text" name="name" placeholder="npr. Jana Jovanovic"/>
                    </label>

                    <span class="login-form__label__span" data-err-span="name"></span>

                    <label class="login-form__label login-form__element">Email adresa:
                        <input class="login-form__input" type="text" name="email"
                            placeholder="Unesi svoju e-mail adresu" />
                    </label>

                    <span class="login-form__label__span" data-err-span="email"></span>

                    <label class="login-form__label login-form__element">Lozinka:
                        <input class="login-form__input" type="password" name="password"
                            placeholder="Unesi svoju lozinku" />
                        <span class="login-form__password__eye">
                            <img class="login-form__password__eye-icon" src="./images/eye-on.svg" />
                        </span>
                    </label>

                    <span class="login-form__label__span" data-err-span="password"></span>

                    <label class="login-form__label login-form__element">Potvrdi Lozinku:
                        <input class="login-form__input" type="password" name="confirmPassword"
                            placeholder="Unesi svoju lozinku" />
                        <span class="login-form__password__eye">
                            <img class="login-form__password__eye-icon" src="./images/eye-on.svg" />
                        </span>
                    </label>


                    <span class="login-form__label__span" data-err-span="confirmPassword"></span>

                    <p class="login-form__element login-form__links login-form__links--highlighted">Registruj se da
                        ostvaris popuste!</p>
                    <button class="login-form__submit-button uppercase headings-font login-form__element"
                        type="submit">registruj
                        se</button>
                    <p class="login-form__element login-form__links">Vec imas profil? <span
                            class="login-form__links--highlighted login-form__switch-btn" data-switch-to="login">Uloguj se!</span></p>
                </form>
            </div>
        `;
    };

    _generateUserPanel() {
        return `
        <div class="login-container__mask">
                <div class="login-container__user-panel">
                    <div class="user-panel__user-info">
                        <p class="login-container__close-btn">&#10006;</p>

                        <form class="login-form user-panel__form" data-action="update">
                            <label class="login-form__label login-form__element">Ime:
                                <input class="user-panel-form__input" type="text" name="name" placeholder="" data-placeholder="npr. Jana Jovanovic"/>
                            </label>
                            <label class="login-form__label login-form__element">Email:
                                <input class="user-panel-form__input" type="email" name="email" placeholder="" data-placeholder="npr: mojmejl@gmail.com"/>
                            </label>
                            <label class="login-form__label login-form__element">Poštanski kod:
                                <input class="user-panel-form__input" type="text" name="postal" placeholder="" data-placeholder="npr: 21000"/>
                            </label>
                            <label class="login-form__label login-form__element">Mesto:
                                <input class="user-panel-form__input" type="text" name="city" placeholder="" data-placeholder="npr: Novi Sad"/>
                            </label>
                            <label class="login-form__label login-form__element">Adresa:
                                <input class="user-panel-form__input" type="text" name="address" placeholder="" data-placeholder="npr: Bulevar Evrope 11/9"/>
                            </label>
                            <label class="login-form__label login-form__element">Telefon:
                                <input class="user-panel-form__input" type="text" name="telephone" placeholder="" data-placeholder="npr: 060 123 4 567"/>
                            </label>
                            <p class="login-form__element login-form__links login-form__links--highlighted">Želiš da
                                promeniš lozinku?</p>
                            <button class="login-form__submit-button uppercase headings-font login-form__element"
                                type="submit">sacuvaj promene</button>
                        </form>
                        <p class="user-panel__form__edit-profile user-panel__btn--logout">Izloguj se</p>
                        <p class="user-panel__form__edit-profile">Obriši profil</p>
                    </div>

                    <div class="user-panel__user-avatar">
                        <div class="user-panel__user-avatar__picture">
                            <p class="user-panel__user-avatar__name-initials">ik</p>
                        </div>
                        <p class="user-panel__user-avatar__name">ime korisnika</p>
                    </div>
                </div>
            </div>
        `;
    };

    _generateResetPassword() {
        return `
        <div class="login-container__mask" id="reset-modal">
        <form class="login-form" data-action="password">
        <p class="login-container__close-btn">&#10006;</p>
            <h4 class="uppercase headings-font login-form__element">promeni lozinku</h4>

            <label class="login-form__label login-form__element">Lozinka:
                <input class="login-form__input login-form__input--password" type="password" name="password"
                    placeholder="Unesi novu lozinku" />
                <span class="login-form__password__eye">
                    <img class="login-form__password__eye-icon" src="./images/eye-on.svg" />
                </span>
            </label>

            <span class="login-form__label__span" data-err-span="password"></span>

                    <label class="login-form__label login-form__element">Potvrdi Lozinku:
                        <input class="login-form__input" type="password" name="confirmPassword"
                            placeholder="Unesi novu lozinku" />
                        <span class="login-form__password__eye">
                            <img class="login-form__password__eye-icon" src="./images/eye-on.svg" />
                        </span>
                    </label>

                <span class="login-form__label__span" data-err-span="confirmPassword"></span>

            <button class="login-form__submit-button uppercase headings-font login-form__element"
                type="submit">Promeni Lozinku</button>
        </form>
    </div>
        `;
    };
};

export default new LoginView();