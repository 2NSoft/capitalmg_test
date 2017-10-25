const Users = require('./user.data.js');
const Roles = require('./role.data.js');

const init = (db) => {
    return {
         users: new Users(db),
         roles: new Roles(db),
    };
};

module.exports = { init };
