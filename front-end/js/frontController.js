import { API_URL } from '../frontConfig.js';
import * as model from './frontModel.mjs';
import navbarView from './../views/navbarView.mjs';
import loginView from '../views/loginView.mjs';

console.log('we are live 1', API_URL);

let getData = async function () {
    try {
        // 1) fetch artikle iz DB
        const response = await fetch(API_URL, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        let data = await response.json();
        console.log(data, 'podaci su fetchovani');

        // 2) proveri da li su artikli dostupni sa servera
        if (!data || data.results === 0) throw new Error;

        // 3) update leggingsState podacima koje si fetchovao sa DB
        model.createLeggingsStateObj(data);
    } catch (error) {
        console.log('ooopssss', error);
        throw error;
    }
};

//////////// ovde treba namestiti controller u login view ali za sad je ovo samo test
// let getUrlBtn = document.querySelector('.get-admin-url');
// getUrlBtn.addEventListener('click', function () {
//     console.log(logovani.adminPanelUrl)
// });
////////////

const korisnik = {
    email: "admin@gmail.com",
    password: "1234",
    // confirmPassword: "1234",
    // email: "test@gmail.com",
    // telephone: "0640777568",
    // address: "antona",
    // postal: "21000",
    // city: "ns"
};

const login = async function () {
    try {
        // 1) fetch artikle iz DB
        const response = await fetch(`${API_URL}/users/login`, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Origin': `${API_URL}/users/login`,
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            redirect: 'follow', // manual, *follow, error
            // referrerPolicy: 'no-referrer',
            body: JSON.stringify(korisnik) ////////////////////
        });
        let data = await response.json();

        // 2) proveri da li postoji odgovor sa servera
        if (!data) throw new Error;

        // 3) update userState podacima koje si fetchovao sa DB
        model.createUserStateObj(data);

    } catch (error) {
        console.log('ooopssss', error);
        // throw error;
    };
};

const loginFromData = async function (dataOfForm) {
    try {
        console.log('inside login handler')
        // 1) renderuj spinner na zadatom elementu
        const formSubmitBtn = document.querySelector('.login-form__submit-button');
        loginView.renderSpinner(formSubmitBtn); //////////////////////////////////////

        const response = await fetch(`${API_URL}/users/login`, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Origin': `${API_URL}/users/login`,
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(dataOfForm)
        });
        let data = await response.json();
        console.log(data);

        // 2) proveri sta je odgovor sa servera i ispisi res.message u submit dugmetu
        loginView.renderSpinner(formSubmitBtn, `${data.message ? data.message : 'Ulogovani ste!'}`);

    } catch (error) {
        console.log(error);
        loginView.renderSpinner(formSubmitBtn, `${error.message}`);
    }
};

const registerFromData = async function (dataOfForm) {
    try {
        // 1) renderuj spinner na zadatom elementu
        const formSubmitBtn = document.querySelector('.login-form__submit-button');
        loginView.renderSpinner(formSubmitBtn); //////////////////////////////////////

        const response = await fetch(`${API_URL}/users/signup`, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Origin': `${API_URL}/users/login`,
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(dataOfForm)
        });
        let data = await response.json();
        console.log(data);

        // 2) proveri sta je odgovor sa servera i ispisi res.message u submit dugmetu
        loginView.renderSpinner(formSubmitBtn, `${data.message ? data.message : 'Registrovani ste!'}`);

    } catch (error) {
        console.log(error);
        loginView.renderSpinner(formSubmitBtn, `${error.message}`);
    }
};



///////// HANDLER FUNKCIJE
const loggerHandler = async (data) => {
    try {
        // 1) proveri da su prosledjeni podaci
        if (!data) return;
        console.log('logger handler', data);

        // 2) ako je prosledjen LOGIN, a) prosledi podatke na server login rutu, b) upisi response u user state, c) skloni login formu
        if (data.action === 'login') loginFromData(data);

        // 3) ako je prosledjen REGISTER, a) prosledi na register rutu, b) uloguj korisnika/upisi ga u user state, c) skloni register formu
        if (data.action === 'register') registerFromData(data);

        // 4) ako je prosledjen UPDATE, a) prosledi na patch rutu, b) upisi korisnika u user state, c) update user panel

    } catch (error) {
        console.log(error)
    };
};


const handleNavbarView = async function () {
    try {
        // 1) proveri da li state ima podatke, ako nema fetchuj podatke i kreiraj state za leggings
        if (model.leggingsState.results === null) await getData();

        // 2) pozovi render funkciju da renderuje markup podacima koje sada subnav view ima 
        navbarView.initialize(model.leggingsState);
    } catch (error) {
        console.log(error);
    };
};

const handleLoginView = async function () {
    try {
        // 1) proveri da li postoji ulogovan korisnik
        // await login(); // privremeno je ovde da lazira korisnika
        if (model.userState.user) {
            console.log('korisnik je ulogovan', model.userState.user.name);

            // 2) ako postoji, initcijalizuj loginView podacima iz model.userState
            loginView.initialize(model.userState);
            console.log(loginView);
            return true;
        };

        // 3) ako korisnik ne postoji/nije ulogovan
        if (!model.userState.user) {
            console.log('korisnik nije ulogovan');
            return false;
        }
    } catch (error) {
        console.log(error);
    };
};

const handleProfileIconClick = function () {
    loginView.showLoginView();
};

const handleFormCloseButtonClick = function () {
    navbarView.removeNavFixedPosition();
};

/////////

const init = function () {
    // inicijalizacija navbara
    navbarView.addHandlerInitialize(handleNavbarView);
    navbarView.addHandlerloginIconClick(handleProfileIconClick);
    // prikaz login/register forme na click
    loginView.addHandlerrender(handleLoginView);
    loginView.addHandlerLoginFormCloseBtn(handleFormCloseButtonClick);
    // login/register
    loginView.addLoginHandler(loggerHandler);
};
init();