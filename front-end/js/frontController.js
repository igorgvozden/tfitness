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
                'Content-Type': 'application/json'
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer',
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

///////// HANDLER FUNKCIJE

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
        await login(); // privremeno je ovde da lazira korisnika

        if (!model.userState.user) return;

        // 2) ako postoji, initcijalizuj loginView podacima iz model.userState
        loginView.initialize(model.userState);
        console.log(loginView)
        console.log('handler za loginView');
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
    navbarView.addHandlerInitialize(handleNavbarView);
    // getUsers();
    loginView.addHandlerrender(handleLoginView);
    navbarView.addHandlerloginIconClick(handleProfileIconClick);
    loginView.addHandlerLoginFormCloseBtn(handleFormCloseButtonClick);
};
init();