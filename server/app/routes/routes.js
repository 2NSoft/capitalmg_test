/* globals __dirname */

const fs = require('fs');
const path = require('path');

const attachRoutes = (app, data) => {
    fs.readdirSync(__dirname)
        .filter( ( file ) => file.includes( '.routes' ) )
        .map((file)=>path.join(__dirname, file))
        .forEach((modulePath) => {
            require(modulePath)(app, data);
        });
};

module.exports = { attachRoutes };
