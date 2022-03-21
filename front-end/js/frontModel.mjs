///////////// STATE ZA KORISNIKA

// state za ulogovanog korisnika
export let userState = {

};

export const createUser = function (data) {
    return {
        email: data.email,
        name: data.name,
        postal: data.postal,
        city: data.city,
        address: data.address,
        telephone: data.telephone,
        id: data.id,
        adminPanelUrl: data.adminPanelUrl
    };
};

export const createUserStateObj = function (resData) {
    userState.user = new Object(createUser(resData)); /////
    console.log('User State:', userState);
};

////////////////////////////////////
// state za login/register attempt
export const possibleUser = {

};

export const createPossibleUserObj = function (currentData) {
    console.log(currentData)
    const { user } = currentData;
    possibleUser = new Object(createPossibleUser(user));
    console.log('current User:', possibleUser);
};

export const createPossibleUser = function (data) {
    console.log(data)
    return {
        email: data.email,
        password: data.password
    };
};

//////////////////////////////
//////////// STATE ZA ARTIKLE

export const leggingsState = {
    results: null,
    leggings: [],
    bookmarks: [],
    cart: []
};

// KREIRANJE PODATAKA U STATE
export const createLeggings = function (leggings) {
    return {
        active: leggings.active,
        colors: leggings.colors,
        description: leggings.description,
        discount: leggings.discount,
        name: leggings.name,
        item: leggings.item,
        price: leggings.price,
        quantities: leggings.quantities,
        sizeGuides: leggings.sizeGuides,
        sizes: leggings.sizes,
        id: leggings._id
    };
};

export const createLeggingsStateObj = function (data) {
    const { results, data: { leggings } } = data;

    leggingsState.results = results;
    leggingsState.leggings = leggings.map(el => createLeggings(el));
    leggingsState.bookmarks = loadBookmarks();
    console.log(leggingsState, 'ovde treba skloniti spinner');
};

// BOOKMARKS
export const persistBookmarks = function () {
    localStorage.setItem('leggingsBookmarks', JSON.stringify(leggingsState.bookmarks));
};

export const addBookmark = function (item) {
    leggingsState.bookmarks.push(item);

    persistBookmarks();
};

export const loadBookmarks = function () {
    const storage = localStorage.getItem("leggingsBookmark");

    if (!storage || storage.length === 0) return;
    return storage;
};

export const deleteBookmark = function () {

};

export const clearAllBookmarks = function () {
    localStorage.clear('leggingsBookmarks');
};

///////////////////////////////
// CART

export const persistCart = function (cart) {
    // sacuvaj cart u localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // postavi cart u leggingsState.cart
    leggingsState.cart = JSON.parse(localStorage.getItem('cart'));
    console.log(leggingsState.cart, 'state cart');
};

export const addToCart = function (item) {
    const storage = localStorage.getItem('cart');

    // 1) ako je LC prazan, dodaj item
    if (storage === null) {
        persistCart([item]);
    };

    // 2) ako LC nije prazan, pushuj item uz postojece artikle
    if (storage) {
        // parsuj LC
        const parsedStorage = JSON.parse(storage);

        // proveri da li postoje dupli artikli
        //////////// ako postoji, promeni quantity artikla na +=1
        const duplicate = parsedStorage.find(el => {
            const sample = el.name + el.color + el.size;
            const compareTo = item.name + item.color + item.size;

            if (JSON.stringify(sample) === JSON.stringify(compareTo)) {
                el.quantity += 1;
                return el;
            };
        });

        // pushuj item iz store-a u parsed localStorage
        parsedStorage.push(item);

        // const filtered = parsedStorage.filter((el, i, array) => array.findIndex(el2 => (JSON.stringify(el2) === JSON.stringify(el))) === i); /////////////
        // filteruj sve duplikate iz arraya
        const filtered = parsedStorage.filter((el, i, array) => {
            return array.findIndex(el2 => {
                const sample = el.name + el.color + el.size;
                const compareTo = el2.name + el2.color + el2.size;

                return (sample === compareTo);
            }) === i;
        });

        console.log(parsedStorage, 'parsed');
        console.log(filtered, 'filtered');
        console.log(duplicate, 'duplicate');

        // sacuvaj cart u localStorage
        persistCart(filtered);
    };

};

export const loadCart = function () {
    const storage = localStorage.getItem('cart');
    const parsedStorage = JSON.parse(storage);

    if (!parsedStorage || parsedStorage.length < 1) {
        localStorage.clear();
        console.log('front model - cart je prazan');
        return;
    };

    leggingsState.cart.push(...parsedStorage);
    console.log('front model - cart', parsedStorage);
    return parsedStorage;
};

export const removeCartItem = function (item = undefined) {
    const storage = localStorage.getItem('cart');
    const parsedStorage = JSON.parse(storage);

    if (!item) return;

    // ako item postoji u localStorage, obrisi ga
    const reduced = parsedStorage.filter(el => {
        const sample = el.name + el.color + el.size;

        if (sample !== item) return el;
    });

    // sacuvaj novi cart u localStorage
    persistCart(reduced);
};

export const increaseItemQuantity = function (item) {
    const storage = localStorage.getItem('cart');
    const parsedStorage = JSON.parse(storage);

    parsedStorage.find(el => {
        const sample = el.name + el.color + el.size;

        if (sample === item) {
            el.quantity += 1;
        };
    });

    const filtered = parsedStorage.filter((el, i, array) => array.findIndex(el2 => (JSON.stringify(el2) === JSON.stringify(el))) === i);
    persistCart(filtered);
}

export const decreaseItemQuantity = function (item) {
    const storage = localStorage.getItem('cart');
    const parsedStorage = JSON.parse(storage);

    parsedStorage.find(el => {
        const sample = el.name + el.color + el.size;

        if (sample === item) {
            el.quantity -= 1;
        };
    });

    const filtered = parsedStorage.filter((el, i, array) => array.findIndex(el2 => (JSON.stringify(el2) === JSON.stringify(el))) === i);
    persistCart(filtered);
}
