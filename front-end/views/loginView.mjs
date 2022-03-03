import View from './view.mjs';

class LoginView extends View {
    _data;
    _parentElement = document.querySelector('.login-container');

    // handler funkcija koja ce biti pozvana iz controller/navbarView kako bi se prikazao login/register
    addHandlerrender(handler) {
        this._renderComponent(this._generateLogin());
        this._loginRegisterSwitch();
        handler();
    };

    // handler za close button forme koji ce controller proslediti i navbaru da vrati fixed position navu
    addHandlerLoginFormCloseBtn(handler) {
        this._parentElement.addEventListener('click', (e) => {
            const closeBtn = e.target.closest('.login-container__close-btn');
            if (!closeBtn) return;
            this.showLoginView();
            handler();
        });
    };

    addLoginHandler(handler) {

    };

    showLoginView() {
        this._parentElement.classList.toggle('hidden');
    };

    // 1) potreban mi je jedan prozor koji ce da renderuje markup u zavisnosti da li logovan ili ne (kao i login/register switch)
    _loginRegisterSwitch() {
        this._parentElement.addEventListener('click', (e) => {
            const switchBtn = e.target.closest('.login-form__switch-btn');
            console.log(switchBtn)
            if (!switchBtn) return;

            const switchTo = switchBtn.dataset['switchTo'];
            console.log(switchTo);
            if (switchTo === 'login') return this._renderComponent(this._generateLogin());
            if (switchTo === 'register') return this._renderComponent(this._generateRegister());
        });
    };

    _renderComponent(markup, route) {
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
        this._collectFormData(route);
    };

    // 2) na pocetku treba proveriti da li je korisnik ulogovan to ce raditi odmah na pocetku model i proslediti podatke o korisniku ovde i navbaru

    // 3) ako nije ulogovan klik na Profil treba da vodi Login/register renderu 

    // 4) prikupljanje podataka iz forme sa rutama za login/register
    _collectFormData() {
        const userForm = document.querySelector('.login-form');
        userForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const dataArray = [...new FormData(this)];
            const userData = Object.fromEntries(dataArray);
            console.log(userData)
            // 1) proveri form inpute - da li su svi popunjeni

            // 2) handler ovde salje req za login ili register

        });
    };

    // 5) mogucnost menjanja login/register sa rutama za jedno ili drugo

    // 6) ako je ulogovan, ikonica Profil treba da vodi ka editovanju prozora (renderuje sadrzaj da menja svoje podatke) i ruta za patch/delete profila

    _generateLogin() {
        return `
        <div class="login-container__mask">
        <form class="login-form">
        <p class="login-container__close-btn">&#10006;</p>
            <h4 class="uppercase headings-font login-form__element">uloguj se u svoj profil</h4>
            <label class="login-form__label login-form__element">Email adresa:
                <input class="login-form__input" type="email" name="email"
                    placeholder="Unesi svoju e-mail adresu" />
            </label>
            <label class="login-form__label login-form__element">Lozinka:
                <input class="login-form__input" type="password" name="password"
                    placeholder="Unesi svoju lozinku" />
                <span class="login-form__password__eye">
                    <img src="./images/eye-on.svg" />
                </span>
            </label>
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
                <form class="login-form">
                <p class="login-container__close-btn">&#10006;</p>
                    <h4 class="uppercase headings-font login-form__element">registruj se</h4>
                    <label class="login-form__label login-form__element">Napisi nam svoje ime:
                        <input class="login-form__input" type="text" name="name" placeholder="npr. Jana Jovanovic" />
                    </label>
                    <label class="login-form__label login-form__element">Email adresa:
                        <input class="login-form__input" type="email" name="email"
                            placeholder="Unesi svoju e-mail adresu" />
                    </label>
                    <label class="login-form__label login-form__element">Lozinka:
                        <input class="login-form__input" type="password" name="password"
                            placeholder="Unesi svoju lozinku" />
                        <span class="login-form__password__eye">
                            <img src="./images/eye-on.svg" />
                        </span>
                    </label>
                    <label class="login-form__label login-form__element">Potvrdi Lozinku:
                        <input class="login-form__input" type="password" name="confirmPassword"
                            placeholder="Unesi svoju lozinku" />
                        <span class="login-form__password__eye">
                            <img src="./images/eye-on.svg" />
                        </span>
                    </label>

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
};

export default new LoginView();