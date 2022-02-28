


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
