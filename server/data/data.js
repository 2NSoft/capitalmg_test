const Users = require('./user.data.js');


const init = (db) => {
    return {
         users: new Users(db),
    };
};

module.exports = { init };
