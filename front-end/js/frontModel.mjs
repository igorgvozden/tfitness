///////////// STATE ZA KORISNIKA

// state za ulogovanog korisnika
export const userState = {

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
    const { user } = resData.data;
    userState.user = new Object(createUser(user));
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
//////////// STATE ZA PROIZVODE

export const leggingsState = {
    results: null,
    leggings: [],
    bookmarks: []
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

export const addBookmark = function (legging) {
    leggingsState.bookmarks.push(legging);

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