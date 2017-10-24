/* globals $ */

const getCategories = () => {
    return $.get('/api/v1/categories');
};

module.exports = {
    getCategories,
};
