import { API_URL } from '../frontConfig';
import * as model from '../js/frontModel';
import subNavView from '../views/subNavView';

console.log('we are live', API_URL);

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

let logovani;

let login = async function () {
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
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(korisnik)
        });
        let data = await response.json();

        console.log(data.data.user)

        logovani = data.data.user;


        // 2) proveri da li su artikli dostupni sa servera
        // if (!data || data.results === 0) throw new Error;

        // 3) update leggingsState podacima koje si fetchovao sa DB
        // model.createLeggingsStateObj(data);
    } catch (error) {
        console.log('ooopssss', error);
        throw error;
    }
};

///////// HANDLER FUNKCIJE

// ovde treba da dodam funkcijju koja ce da bude handler parametar funkcija za subnavview
//ova fja se poziva kao parametar funkcije iz subnavview u init()
// ova funkcija poziva i model state

const subNavViewHandlerRender = async function () {
    try {
        // 1) proveri da li state ima podatke, ako nema fetchuj podatke i kreiraj state za leggings
        if (model.leggingsState.results === null) await getData();

        // 2) pozovi render funkciju da renderuje markup podacima koje sada subnav view ima 
        subNavView.render(model.leggingsState);
    } catch (error) {
        console.log(error)
    }
};

/////////

const init = function () {
    subNavView.addHandlerRender(subNavViewHandlerRender);
    subNavView.addMouseOver();
    subNavView.addMouseOut();
    // login();
};
init();