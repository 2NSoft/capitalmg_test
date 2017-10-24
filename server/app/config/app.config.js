/* globals __dirname */
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const configApp = (app) => {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    const staticPath = path.join(__dirname, '../../../public/');
    app.use(express.static(staticPath));

    app.use( '/libs',
        express.static(
            path.join(__dirname, '../../../node_modules/'))
    );

    app.use(cookieParser('keyboard cat'));

    app.use(session({
        saveUninitialized: true,
        resave: false,
        secret: 'secret',
        maxAge: 60000,
    }));

    return Promise.resolve(app);
};

module.exports = { configApp };


