/* globals __dirname */

const fs = require('fs');
const path = require('path');

const init = (db) => {
    const data = {};
    fs.readdirSync(__dirname)
        .filter((file) => file.includes('.data.js'))
        .map((file) => {
            return {
                fullPath: path.join(__dirname, file),
                name: file.slice(0, file.length - '.data.js'.length),
            };
        })
        .forEach((module) => {
            if (module.name==='base') return false;
            const Module = require(module.fullPath);
            data[module.name + 's'] = new Module(db);
            return true;
        });
    return data;
};

module.exports = { init };
