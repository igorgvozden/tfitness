import { API_URL } from '../frontConfig.js';
import * as model from './frontModel.mjs';
import navbarView from './../views/navbarView.mjs';
import loginView from '../views/loginView.mjs';
import heroView from '../views/heroView.mjs';
import cartView from '../views/cartView.mjs';

console.log('we are live 1', API_URL);

const getData = async function () {
    try {
        // 1) fetch artikle iz DB
        const response = await fetch(API_URL, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'include', // mora da postoji ovde da bi req poslao cookie
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

        // 4) renderuj hero view
        heroView.addHandlerRender(model.leggingsState.leggings);
        console.log(heroView, 'ovo je heroView');

        // 5) proveri da li postoji ulogovan korisnik, response.locals prosledjuje: data.user
        if (!data.user) return;
        model.createUserStateObj(data.user);

        // 6) renderuj user panel za ulogovanog korisnika
        loginView.addHandlerRender(handleLoginView);
        loginView.addLogoutHandler(logout);

        // 7) renderuj dugme za admina ako je ulogovan
        console.log(navbarView, data);
        navbarView.renderAdminIcon(data.user.admin, data.user.adminPanelUrl);

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

        // 3) upisi ulogovanog korisnika u user.state
        if (data.status === 'success') {
            model.createUserStateObj(data);
            // reload stranicu ako je korisnik ulogovan
            reloadPage(700);
        };

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

const logout = async function () {
    try {
        const formSubmitBtn = document.querySelector('.login-form__submit-button');
        loginView.renderSpinner(formSubmitBtn); //////////////////////////////////////

        const response = await fetch(`${API_URL}/users/logout`, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'include', // mora da postoji ovde da bi req poslao cookie
            headers: {
                'Content-Type': 'application/json'
            }
        });
        let data = await response.json();

        console.log(data, 'logout');
        if (data.status === 'success') {
            reloadPage(100);
            loginView.renderSpinner(formSubmitBtn, `${data.message ? data.message : 'Izlogovani ste!'}`);
            navbarView.renderUserIcon('out');
        };
    } catch (error) {
        console.log(error);
    };
};

const updateUser = async function (dataOfForm) {
    try {
        const formSubmitBtn = document.querySelector('.login-form__submit-button');
        loginView.renderSpinner(formSubmitBtn); //////////////////////////////////////

        const response = await fetch(`${API_URL}/users/updateme`, {
            method: 'PATCH',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Origin': `${API_URL}/users/updateme`,
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(dataOfForm)
        });
        let data = await response.json();

        model.createUserStateObj(data);

        if (data.status === 'success') {
            loginView.renderSpinner(formSubmitBtn, `${data.message ? data.message : 'Promene su sacuvane!'}`);
        };

        console.log('korisnik je updejtovan', data, model.userState);
    } catch (error) {
        console.log(error)
    };
};

const resetPassword = async function (dataOfForm) {
    try {
        const formSubmitBtn = document.querySelector('.login-form__submit-button');
        loginView.renderSpinner(formSubmitBtn); //////////////////////////////////////

        // napravi fetch na ruti za pass
        const response = await fetch(`${API_URL}/users/resetpassword/:${dataOfForm.resetToken}`, {
            method: 'PATCH',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Origin': `${API_URL}/users/resetpassword/:${dataOfForm.resetToken}`,
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(dataOfForm)
        });

        const data = await response.json();
        console.log(data, 'reset pass data');

    } catch (error) {
        console.log(error);
    };
};

///////// HANDLER FUNKCIJE
const loggerHandler = async (data) => {
    try {
        // 1) proveri da li su prosledjeni podaci
        if (!data) return;
        console.log('logger handler', data);

        // 2) ako je prosledjen LOGIN, a) prosledi podatke na server login rutu, b) upisi response u user state, c) skloni login formu
        if (data.action === 'login') loginFromData(data);

        // 3) ako je prosledjen REGISTER, a) prosledi na register rutu, b) uloguj korisnika/upisi ga u user state, c) skloni register formu
        if (data.action === 'register') registerFromData(data);

        // 4) ako je prosledjen UPDATE, a) prosledi na patch rutu, b) upisi korisnika u user state, c) update user panel
        if (data.action === 'update') {
            updateUser(data);
            reloadPage(1000);
        };

        // 5) ako je prosledjen RESET, a) prsledi na resetPAssword rutu, b) upisi korisnika u userState/uloguj ga, c) obrisi hash iz URL
        if (data.action === 'reset') {
            resetPassword(data);
        };
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

        // 3) proveri da li je korisnik ulogovan i da li je Admin

    } catch (error) {
        console.log(error);
    };
};

// const handleHeroView = async function () {
//     try {
//         // 1) proveri da li model ima podatke
//         if (model.leggingsState.results === null) await getData();

//         // 2) inicijalizuj heroView podacima
//         heroView.initialize(model.leggingsState.leggings);
//         console.log(heroView, 'ovo je heroView');

//     } catch (error) {
//         console.log(error);
//     }
// };

const handleLoginView = async function () {
    try {
        // 1) proveri da li postoji ulogovan korisnik
        if (model.userState.user) {
            console.log('korisnik je ulogovan', model.userState.user.name);

            // 2) ako postoji, initcijalizuj loginView podacima iz model.userState
            loginView.initialize(model.userState);
            console.log(loginView);

            // 3) ako je korisnik ulogovan promeni ikonicu za korisnika loggedin
            navbarView.renderUserIcon('in');
            return true;
        };

        // 4) ako korisnik ne postoji/nije ulogovan
        if (!model.userState.user) {
            console.log('korisnik nije ulogovan');

            // 5} promeni ikonicu korisnika u loggedout
            navbarView.renderUserIcon('out');
            return false;
        }
    } catch (error) {
        console.log(error);
    };
};

const handleProfileIconClick = function () {
    loginView.showLoginView();
    heroView.blurParentElement();
};

const handleFormCloseButtonClick = function () {
    navbarView.removeNavFixedPosition();
    heroView.blurParentElement();
};

const handleCartIconClick = function () {
    cartView.toggleShowCart();
};

const reloadPage = function (miliseconds = 1000) {
    window.setTimeout(() => location.reload(), miliseconds);
};

// CART HANDLERS

const addToCart = function (item) {
    model.addToCart(item);
    cartView.initialize({ user: model.userState, cart: model.leggingsState.cart });
    cartView.updateCart();

    navbarView.addCartBadge(model.leggingsState.cart);
};

const removeCartItem = function (item) {
    model.removeCartItem(item);
    cartView.initialize({ user: model.userState, cart: model.leggingsState.cart });
    cartView.updateCart();

    navbarView.addCartBadge(model.leggingsState.cart);
};

const increaseItemQuantity = function (item) {
    model.increaseItemQuantity(item);
    cartView.initialize({ user: model.userState, cart: model.leggingsState.cart });
    cartView.updateCart();

    navbarView.addCartBadge(model.leggingsState.cart);
};

const decreaseItemQuantity = function (item, itemQuantity) {
    itemQuantity > 1 ? model.decreaseItemQuantity(item) : model.removeCartItem(item);
    cartView.initialize({ user: model.userState, cart: model.leggingsState.cart });
    cartView.updateCart();

    navbarView.addCartBadge(model.leggingsState.cart);
};
/////////

const init = function () {
    // inicijalizacija navbara
    navbarView.addHandlerInitialize(handleNavbarView);
    navbarView.addHandlerloginIconClick(handleProfileIconClick);
    navbarView.addCartIconHandler(handleCartIconClick);
    // prikaz login/register forme na click
    loginView.addHandlerRender(handleLoginView);
    loginView.addHandlerLoginFormCloseBtn(handleFormCloseButtonClick);
    // login/register/update user
    loginView.addLoginHandler(loggerHandler);
    // inicijalizacija cart-a i aktiviranje dugmica
    model.loadCart();
    cartView.initialize({ user: model.userState, cart: model.leggingsState.cart });
    heroView.addAddToCartHandler(addToCart);
    cartView.addRemoveCartItemHandler(removeCartItem);
    cartView.addIncreaseQuantityHandler(increaseItemQuantity);
    cartView.addDecreaseQuantityHandler(decreaseItemQuantity);
    navbarView.addCartBadge(model.leggingsState.cart);

};
init();