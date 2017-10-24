const express = require('express');
const app = express();

const init = (data) => {
    require('./config/app.config.js').configApp(app);
    require('../config/passport.config.js')(app, data);

    app.use( ( req, res, next) => {
        const user = {
            loggedIn: (req.user ? true : false),
            username: (req.user ? req.user.username : 'Anonymous'),
            userId: (req.user ? req.user.id : null ),
        };
        res.locals.user = user;
        next();
    });

    require('./routes').attachRoutes(app, data);

    app.get('/*', (req, res) => {
        res.status(404).send('Resourse not found');
    });

    return Promise.resolve(app);
};

module.exports = { init };
